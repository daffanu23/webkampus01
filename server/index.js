require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// --- MIDDLEWARE ---
// Mengizinkan akses dari semua domain (penting agar frontend Netlify bisa masuk)
app.use(cors());
app.use(express.json());

// --- KONEKSI SUPABASE ---
// Pastikan SUPABASE_URL dan SUPABASE_KEY sudah ada di:
// 1. File .env (untuk di laptop)
// 2. Dashboard Vercel > Settings > Environment Variables (untuk di server online)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- ROUTES ---

// 1. Route Root (Untuk Cek Server Hidup)
// Ini yang akan tampil saat Anda buka https://webkampus-fullstack.vercel.app/
app.get('/', (req, res) => {
    res.send('Server Backend Web Kampus Berjalan! (Vercel Ready)');
});

// 2. API Achievements
app.get('/api/achievements', async (req, res) => {
    try {
        const { data, error } = await supabase.from('achievements').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. API News
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

// 4. API Schemes (Pencarian)
app.get('/api/schemes', async (req, res) => {
    try {
        let query = supabase.from('schemes').select('*');

        // Ambil filter dari URL (?type=Workshop&city=Bandung)
        const { type, city, date } = req.query;

        if (type && type !== 'All Events') {
            query = query.eq('type', type);
        }
        if (city && city !== 'All Cities') {
            query = query.eq('city', city);
        }
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

// --- PENTING UNTUK VERCEL ---

const PORT = process.env.PORT || 5000;

// Logika: Jika dijalankan di laptop (node index.js), jalankan listen port.
// Jika di Vercel, jangan jalankan listen, tapi export app-nya.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server menyala di http://localhost:${PORT}`);
    });
}

// INI KUNCINYA: Export aplikasi agar Vercel bisa menjalankannya
module.exports = app;