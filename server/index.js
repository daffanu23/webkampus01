require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke Supabase
// Pastikan SUPABASE_URL dan SUPABASE_KEY ada di .env (untuk lokal) 
// dan di Environment Variables Vercel (untuk deploy)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- ROUTES (Jalur Data) ---

// Route Default (Cek Server Nyala)
app.get('/', (req, res) => {
    res.send('Server Backend Web Kampus Berjalan! (Vercel Ready)');
});

// 1. Ambil Data Achievements
app.get('/api/achievements', async (req, res) => {
    try {
        const { data, error } = await supabase.from('achievements').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Ambil Data Berita (Terbaru)
app.get('/api/news', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('published_date', { ascending: false })
            .limit(6);
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Cari Skema (Filter)
app.get('/api/schemes', async (req, res) => {
    try {
        let query = supabase.from('schemes').select('*');

        // Ambil filter dari URL
        const { type, city, date } = req.query;

        if (type && type !== 'All Events') {
            query = query.eq('type', type);
        }
        if (city && city !== 'All Cities') {
            query = query.eq('city', city);
        }
        // Filter tanggal sederhana
        if (date === 'Today') {
            const today = new Date().toISOString().split('T')[0];
            query = query.eq('start_date', today);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- KONFIGURASI SERVER (PENTING UNTUK VERCEL) ---

const PORT = process.env.PORT || 5000;

// Logika ini memastikan server berjalan normal di Localhost,
// tapi tidak bentrok saat dijalankan oleh Vercel (Serverless).
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server menyala di http://localhost:${PORT}`);
    });
}

// Export app agar Vercel bisa menjalankannya
module.exports = app;