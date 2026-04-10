import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function keepAlive() {
    console.log('Sending Keep-Alive request to Supabase...');
    try {
        const { error } = await supabase
            .from('impact_metrics')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Keep-Alive Error:', error.message);
            process.exit(1);
        } else {
            console.log('Keep-Alive Success: Connection active.');
            process.exit(0);
        }
    } catch (err: any) {
        console.error('Keep-Alive Fatal Error:', err.message);
        process.exit(1);
    }
}

keepAlive();
