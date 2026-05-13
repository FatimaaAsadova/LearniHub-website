require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const app = express();

// Render və s. proxy serverlər üçün vacibdir
app.set('trust proxy', 1);

// Dinamik port ayarı (Render üçün mütləqdir)
const PORT = process.env.PORT || 5005;

// Supabase bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// CORS ayarları
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'learnihub-api' });
});

// --- 1. QEYDİYYAT (Register) ---
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Bütün xanaları doldurun!" });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([
                { 
                    username: username.trim(), 
                    email: cleanEmail, 
                    password: hashedPassword 
                }
            ]);

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: "Bu email artıq qeydiyyatdan keçib!" });
            }
            throw error;
        }

        res.json({ message: "Qeydiyyat uğurla tamamlandı!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- 2. GİRİŞ (Login) ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email və şifrə daxil edin!" });

    const cleanEmail = email.trim().toLowerCase();

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .ilike('email', cleanEmail)
            .limit(1);

        if (error || !users || users.length === 0) {
            return res.status(400).json({ error: "İstifadəçi tapılmadı!" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ error: "Şifrə yanlışdır!" });

        res.json({ 
            message: "Giriş uğurludur!", 
            user: { username: user.username, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ error: "Server xətası baş verdi." });
    }
});

// --- 3. SURVEY (ANKET) SİSTEMİ ---
app.post('/api/survey', async (req, res) => {
    const { course_name, link, full_name, description, category } = req.body;

    if (!course_name || !link) {
        return res.status(400).json({ error: "Kurs adı və Kurs linki mütləqdir!" });
    }

    try {
        const { data, error } = await supabase
            .from('surveys')
            .insert([
                { 
                    course_name: course_name.trim(), 
                    link: link.trim(),
                    full_name: full_name ? full_name.trim() : "Anonim",
                    description: description || null,
                    category: category || null
                }
            ]);

        if (error) throw error;

        res.json({ message: "Məlumatlarınız uğurla yadda saxlanıldı!" });
    } catch (error) {
        console.error("❌ Survey xətası:", error.message);
        res.status(400).json({ error: error.message });
    }
});

// --- 4. KURSLAR SİSTEMİ (Bazadan Kursları Çəkmək) ---
app.get('/api/courses', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) {
            console.error("❌ Kurs çəkmə xətası:", error.message);
            throw error;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Kurslar yüklənərkən xəta baş verdi." });
    }
});

// --- 5. CONTACT FORM ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    try {
        const payload = {
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            message: String(message).trim()
        };

        const { error } = await supabase.from('contacts').insert([payload]);
        if (error) {
            throw error;
        }

        res.json({ message: 'Contact message saved successfully.' });
    } catch (error) {
        console.error('❌ Contact save error:', error.message);
        res.status(500).json({ error: 'Could not save contact message.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda aktivdir!`);
});