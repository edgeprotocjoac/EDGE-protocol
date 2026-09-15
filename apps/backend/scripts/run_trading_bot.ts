import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load backend env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DOMAIN = {
    name: 'EdgeProtocolPerpExchange',
    version: '1',
    chainId: Number(process.env.ROBINHOOD_CHAIN_ID || 1699),
    verifyingContract: process.env.PERP_EXCHANGE_ADDRESS!
};

const TYPES = {
    PerpOrder: [
        { name: 'maker', type: 'address' },
        { name: 'perpMarketId', type: 'uint256' },
        { name: 'isLong', type: 'bool' },
        { name: 'size', type: 'uint256' },
        { name: 'price', type: 'uint256' },
        { name: 'margin', type: 'uint256' },
        { name: 'leverage', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiration', type: 'uint256' }
    ]
};

// Load bot wallets from contracts/.env
const BOT_WALLETS = [
    new ethers.Wallet(process.env.PRIVKEY_BOT_A!),
    new ethers.Wallet(process.env.PRIVKEY_BOT_B!),
    new ethers.Wallet(process.env.PRIVKEY_BOT_C!),
    new ethers.Wallet(process.env.PRIVKEY_BOT_D!),
    new ethers.Wallet(process.env.PRIVKEY_BOT_E!)
];

const TICK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes interval instead of 2.5s to prevent cloud egress exhaustion
const WEATHER_KEYWORDS = ['RAIN', 'TEMP', 'SNOW', 'FIRE', 'HEAT', 'FLOOD', 'TYP3', 'WEATHER'];

function isWeatherMarket(marketId: string): boolean {
    return WEATHER_KEYWORDS.some(k => marketId.includes(k));
}

function getTimestamp() {
    return new Date().toISOString().split('T')[1].slice(0, 8);
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 4) {
    const val = (Math.random() * (max - min) + min);
    return parseFloat(val.toFixed(decimals));
}

async function runBot() {
    console.log(`\n======================================================`);
    console.log(`🤖 [${getTimestamp()}] STARTING BRUTAL WEATHER-FOCUSED TRADING BOT`);
    console.log(`🤖 Priority Ratio: 5 WEATHER MARKETS : 1 CRYPTO MARKET`);
    console.log(`🤖 Active Wallets: ${BOT_WALLETS.length} | Interval: ${TICK_INTERVAL_MS}ms`);
    console.log(`======================================================\n`);

    let cycleCount = 0;

    const loop = async () => {
        cycleCount++;
        const cycleTime = getTimestamp();
        console.log(`\n------------------------------------------------------`);
        console.log(`🔄 [CYCLE #${cycleCount} @ ${cycleTime}] Starting trading tick (5 Weather : 1 Crypto)...`);

        try {
            // STEP 1: FETCH ACTIVE MARKETS
            console.log(`   └─ [STEP 1/5: FETCH_MARKETS] Querying active perp markets...`);
            const { data: activeMarkets, error } = await supabase
                .from('perp_markets')
                .select('id')
                .in('status', ['ACTIVE', 'REDUCE_ONLY']);

            if (error || !activeMarkets || activeMarkets.length === 0) {
                console.error(`   ❌ [STEP 1/5 ERROR] Failed to fetch markets:`, error?.message || 'No active markets');
                return;
            }

            const markets: string[] = activeMarkets.map((m: any) => m.id);

            // Separate Weather vs Crypto Markets
            const weatherMarkets = markets.filter(m => isWeatherMarket(m));
            const cryptoMarkets = markets.filter(m => !isWeatherMarket(m));

            // Select 5 Weather Markets & 1 Crypto Market per cycle
            const countWeather = Math.min(weatherMarkets.length, 5);
            const countCrypto = Math.min(cryptoMarkets.length, 1);

            const shuffledWeather = [...weatherMarkets].sort(() => 0.5 - Math.random());
            const shuffledCrypto = [...cryptoMarkets].sort(() => 0.5 - Math.random());

            const selectedMarkets = [
                ...shuffledWeather.slice(0, countWeather),
                ...shuffledCrypto.slice(0, countCrypto)
            ];

            console.log(`   └─ [TARGETS 5:1 RATIO] Weather (${selectedMarkets.filter(m => isWeatherMarket(m)).length}): ${selectedMarkets.filter(m => isWeatherMarket(m)).join(', ')}`);
            console.log(`   └─ [TARGETS 5:1 RATIO] Crypto (${selectedMarkets.filter(m => !isWeatherMarket(m)).length}): ${selectedMarkets.filter(m => !isWeatherMarket(m)).join(', ')}`);

            for (const marketId of selectedMarkets) {
                await placeOrderBookPair(marketId);
            }
        } catch (e: any) {
            console.error(`❌ [CYCLE #${cycleCount} ERROR] Unhandled Exception:`, e.message || e);
        } finally {
            setTimeout(loop, TICK_INTERVAL_MS);
        }
    };

    loop();
}

/**
 * Places a pair of orders (1 LONG bid + 1 SHORT ask) around current mark/index price for a market.
 */
async function placeOrderBookPair(marketId: string) {
    const isCrypto = !isWeatherMarket(marketId) && (marketId.startsWith('PERP-BTC-') || marketId.startsWith('PERP-ETH-'));

    // STEP 2: PREPARE ORDER DATA & PRICE CALCULATION
    console.log(`\n📊 [${marketId}] -> STEP 2/5: PREPARE_ORDER (${isWeatherMarket(marketId) ? '🌤️ Weather Market' : '💰 Crypto Market'})`);
    
    const { data: markData } = await supabase
        .from('perp_mark_prices')
        .select('price')
        .eq('market_id', marketId)
        .order('timestamp', { ascending: false })
        .limit(1);

    let basePrice = isCrypto ? (marketId.includes('BTC') ? 64000 : 3500) : 0.50;
    if (markData && markData.length > 0 && Number(markData[0].price) > 0) {
        basePrice = Number(markData[0].price);
    }
    console.log(`   ├─ Reference Mark Price: $${basePrice}`);

    // Select wallets
    const walletIndexA = getRandomInt(0, BOT_WALLETS.length - 1);
    const walletIndexB = (walletIndexA + 1) % BOT_WALLETS.length;
    const walletLong = BOT_WALLETS[walletIndexA];
    const walletShort = BOT_WALLETS[walletIndexB];

    let longPrice: number;
    let shortPrice: number;
    let sizeStr: string;

    if (isCrypto) {
        const devLong = basePrice * getRandomFloat(0.0005, 0.002, 4);
        const devShort = basePrice * getRandomFloat(0.0005, 0.002, 4);
        longPrice = parseFloat((basePrice - devLong).toFixed(2));
        shortPrice = parseFloat((basePrice + devShort).toFixed(2));
        sizeStr = getRandomFloat(0.01, 0.08, 4).toString();
    } else {
        const devLong = getRandomFloat(0.002, 0.015, 4);
        const devShort = getRandomFloat(0.002, 0.015, 4);
        longPrice = parseFloat(Math.max(0.01, Math.min(0.98, basePrice - devLong)).toFixed(4));
        shortPrice = parseFloat(Math.max(0.02, Math.min(0.99, basePrice + devShort)).toFixed(4));
        sizeStr = getRandomInt(10, 100).toString();
    }

    const leverage = getRandomInt(2, 10).toString();

    console.log(`   ├─ LONG Target : $${longPrice} | Size: ${sizeStr} | Lev: ${leverage}x | Wallet: ${walletLong.address.slice(0, 8)}...`);
    console.log(`   └─ SHORT Target: $${shortPrice} | Size: ${sizeStr} | Lev: ${leverage}x | Wallet: ${walletShort.address.slice(0, 8)}...`);

    // Submit LONG
    await submitBotOrder(walletLong, marketId, true, sizeStr, longPrice.toString(), leverage);
    // Submit SHORT
    await submitBotOrder(walletShort, marketId, false, sizeStr, shortPrice.toString(), leverage);
}

async function submitBotOrder(
    wallet: ethers.Wallet,
    marketId: string,
    isLong: boolean,
    size: string,
    orderPrice: string,
    leverage: string
) {
    const sideText = isLong ? '🟢 LONG' : '🔴 SHORT';
    try {
        const margin = (Number(size) * Number(orderPrice) / Number(leverage)).toFixed(6);
        const nonce = Date.now() + Math.floor(Math.random() * 1000);
        const expiration = nonce + 86400000;
        const numericalMarketId = BigInt(ethers.id(marketId));

        const orderTuple = {
            maker: wallet.address,
            perpMarketId: numericalMarketId,
            isLong: isLong,
            size: ethers.parseUnits(size, 18),
            price: ethers.parseUnits(orderPrice, 18),
            margin: ethers.parseUnits(margin, 18),
            leverage: ethers.parseUnits(leverage, 18),
            nonce: BigInt(nonce),
            expiration: BigInt(expiration)
        };

        const signature = await wallet.signTypedData(DOMAIN, TYPES, orderTuple);
        const orderId = `${wallet.address.slice(0, 6)}-${marketId.slice(0, 10)}-${nonce}`;
        const expirationDate = new Date(expiration).toISOString();

        const { error } = await supabase.from('perp_orders').insert({
            id: `${wallet.address}-${marketId}-${nonce}`,
            network: 'testnet',
            market_id: marketId,
            trader: wallet.address,
            side: isLong ? 'LONG' : 'SHORT',
            size: size,
            price: orderPrice,
            margin: margin,
            leverage: leverage,
            signature: signature,
            nonce: nonce,
            expiration: expirationDate,
            status: 'OPEN'
        });

        if (error) {
            console.error(`   ❌ [STEP 4 ERROR] DB Insert Failed for ${sideText} ${marketId}:`, error.message);
        } else {
            console.log(`   ✅ [STEP 5/5 SUCCESS] ${sideText} Placed! ID: ${orderId} | Price: $${orderPrice}`);
        }
    } catch (e: any) {
        console.error(`   ❌ [SUBMIT ERROR] ${sideText} Failed for ${marketId}:`, e.message || e);
    }
}

runBot().catch(console.error);
