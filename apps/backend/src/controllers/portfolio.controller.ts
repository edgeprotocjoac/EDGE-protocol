import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

export const getUserPortfolio = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const network = process.env.NETWORK || 'TESTNET';

    // Fetch all orders for this user
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('wallet_address', String(address))
      .eq('network', String(network));

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!orders || orders.length === 0) {
      return res.json({ positions: [], history: [] });
    }

    // Extract unique market_ids
    const marketIds = Array.from(new Set(orders.map(o => o.market_id).filter(Boolean)));

    let marketMap: Record<string, any> = {};
    if (marketIds.length > 0) {
      const { data: markets } = await supabase
        .from('markets')
        .select('id, title, image_url, slug')
        .in('id', marketIds);

      markets?.forEach(m => {
        marketMap[m.id] = m;
      });
    }

    // Aggregate positions by market
    const positions: Record<string, any> = {};

    orders.forEach(order => {
      const marketId = order.market_id;
      const marketInfo = marketMap[marketId] || {};

      if (order.status === 'FILLED') {
        if (!positions[marketId]) {
          positions[marketId] = {
            marketId,
            marketTitle: marketInfo.title || 'Unknown Market',
            marketImage: marketInfo.image_url || '',
            marketSlug: marketInfo.slug || '',
            yesShares: 0,
            noShares: 0,
            totalInvested: 0
          };
        }

        const shares = Number(order.amount);
        const cost = (Number(order.price) * shares) / 100; // price is in cents (1-99), cost in USD

        if (order.side === 'YES') {
          positions[marketId].yesShares += shares;
        } else {
          positions[marketId].noShares += shares;
        }

        positions[marketId].totalInvested += cost;
      }
    });

    // Attach market info to orders history as well
    const history = orders.map(order => ({
      ...order,
      markets: marketMap[order.market_id] || null,
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ positions: Object.values(positions), history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
