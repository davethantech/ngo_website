import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
    console.log('Sending Keep-Alive request to Supabase...');
    const { data, error } = await supabase
        .from('impact_metrics')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Keep-Alive Error:', error.message);
    } else {
        console.log('Keep-Alive Success: Connection active.');
    }
}

// Run every 6 days (Supabase pauses after 7 days of inactivity)
keepAlive();
setInterval(keepAlive, 1000 * 60 * 60 * 24 * 6);
