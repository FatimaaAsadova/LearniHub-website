require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Bağlantısı
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Kursları gətirmək üçün GET sorğusu (Bunu axtarırdıq!)
app.get('/api/courses', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Test üçün ana səhifə
app.get('/', (req, res) => {
    res.send('Server aktivdir!');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda aktivdir!`);
});