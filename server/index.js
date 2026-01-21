require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- ROUTES (Jalur Data) ---

// 1. Ambil Data Achievements
app.get('/api/achievements', async (req, res) => {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 2. Ambil Data Berita (Terbaru)
app.get('/api/news', async (req, res) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(6);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 3. Cari Skema (Filter)
app.get('/api/schemes', async (req, res) => {
    let query = supabase.from('schemes').select('*');

    // Ambil filter dari URL (contoh: ?type=Workshop&city=Bandung)
    const { type, city, date } = req.query;

    if (type && type !== 'All Events') {
        query = query.eq('type', type);
    }
    if (city && city !== 'All Cities') {
        query = query.eq('city', city);
    }
    // Filter tanggal (Contoh sederhana untuk 'Today')
    if (date === 'Today') {
        const today = new Date().toISOString().split('T')[0];
        query = query.eq('start_date', today);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server menyala di http://localhost:${PORT}`);
});