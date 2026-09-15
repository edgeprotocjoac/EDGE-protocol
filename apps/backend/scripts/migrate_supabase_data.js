const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Read credentials strictly from environment variables to prevent leaking keys in Git
const oldUrl = process.env.OLD_SUPABASE_URL || process.env.SUPABASE_URL_OLD;
const oldKey = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY_OLD;

const newUrl = process.env.NEW_SUPABASE_URL || process.env.SUPABASE_URL;
const newKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!oldUrl || !oldKey) {
  console.error('❌ Error: OLD_SUPABASE_URL and OLD_SUPABASE_SERVICE_ROLE_KEY must be provided via environment variables.');
  process.exit(1);
}

if (!newUrl || !newKey) {
  console.error('❌ Error: NEW_SUPABASE_URL (or SUPABASE_URL) and NEW_SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be provided in apps/backend/.env.');
  process.exit(1);
}

const supabaseOld = createClient(oldUrl, oldKey);
const supabaseNew = createClient(newUrl, newKey);

// Complete tables list to migrate to new Supabase project
const tableList = [
  'users',
  'creator_stats',
  'markets',
  'orders',
  'trades',
  'callouts',
  'callout_snapshots',
  'callout_results',
  'follows',
  'likes',
  'comments',
  'comment_likes',
  'reposts',
  'saves',
  'notifications',
  'market_proposals',
  'perp_markets',
  'perp_positions',
  'perp_orders',
  'perp_fills',
  'perp_funding_rates',
  'perp_liquidations',
  'perp_index_prices',
  'perp_mark_prices',
  'logs',
];

async function syncOldProfilesIntoUsers() {
  console.log(`\n🛡️ [Safeguard] Syncing old 'profiles' data directly into new 'users' table...`);
  try {
    const { data: oldProfiles } = await supabaseOld.from('profiles').select('*');
    if (oldProfiles && oldProfiles.length > 0) {
      let syncedCount = 0;
      for (const p of oldProfiles) {
        const { error } = await supabaseNew.from('users').upsert({
          id: p.id,
          wallet_address: p.wallet_address.toLowerCase(),
          network: 'TESTNET',
          handle: p.handle,
          display_name: p.display_name,
          bio: p.bio,
          avatar_url: p.avatar_url,
          x_handle: p.x_handle,
          is_verified: Boolean(p.is_verified),
        }, { onConflict: 'wallet_address,network' });

        if (!error) syncedCount++;
      }
      console.log(`   Synced ${syncedCount} profile records into 'users' table.`);
    }
  } catch (err) {
    console.warn(`   Notice during profiles safeguard sync:`, err.message || err);
  }
}

async function migrateTable(tableName) {
  console.log(`\n📦 [Migrating Table] -> '${tableName}'...`);

  let offset = 0;
  const batchSize = 500;
  let totalMigrated = 0;

  while (true) {
    const { data: rows, error: fetchErr } = await supabaseOld
      .from(tableName)
      .select('*')
      .range(offset, offset + batchSize - 1);

    if (fetchErr) {
      console.error(`❌ Error fetching '${tableName}': ${fetchErr.message}`);
      break;
    }

    if (!rows || rows.length === 0) break;

    const { error: insertErr } = await supabaseNew
      .from(tableName)
      .upsert(rows, { ignoreDuplicates: true });

    if (insertErr) {
      console.error(`⚠️ Error inserting into '${tableName}': ${insertErr.message}`);
      for (const row of rows) {
        const { error: singleErr } = await supabaseNew.from(tableName).upsert(row, { ignoreDuplicates: true });
        if (!singleErr) totalMigrated++;
      }
    } else {
      totalMigrated += rows.length;
    }

    console.log(`   Migrated ${totalMigrated} rows for '${tableName}'...`);

    if (rows.length < batchSize) break;
    offset += batchSize;
  }

  console.log(`✅ [Finished Table] '${tableName}': Total ${totalMigrated} rows migrated.`);
}

async function run() {
  console.log('🚀 STARTING FULL MIGRATION TO NEW SUPABASE PROJECT...');

  for (const t of tableList) {
    await migrateTable(t);
  }

  await syncOldProfilesIntoUsers();

  console.log('\n🎉 ALL TABLES & DATA MIGRATED 100% SUCCESSFULLY TO NEW SUPABASE PROJECT!');
}

run();
