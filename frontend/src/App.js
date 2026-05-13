import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Navbar hook-ları istifadə etdiyi üçün ayrıca komponent kimi daxildə qalmalıdır
const Navbar = ({ lang, setLang, translations }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const t = translations[lang] || translations['en'];

  const handleAction = (path) => {
    if (user) {
      navigate(path);
    } else {
      localStorage.setItem('redirectAfterLogin', path);
      navigate('/login');
    }
  };

  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <button onClick={() => navigate('/')} style={navBtnStyle}>Home</button>
        <button onClick={() => handleAction('/start')} style={navBtnStyle}>Start</button>
        <button onClick={() => handleAction('/create')} style={navBtnStyle}>Create</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={() => setLang('az')} style={{ ...langBtnStyle, color: lang === 'az' ? '#28a745' : 'black' }}>AZE</button>
        <button onClick={() => setLang('en')} style={{ ...langBtnStyle, color: lang === 'en' ? '#28a745' : 'black' }}>ENG</button>
        
        {user ? (
          <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{user.email}</span>
            <button onClick={logout} style={{ ...authBtnStyle, backgroundColor: '#dc3545' }}>Logout</button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={{ ...authBtnStyle, backgroundColor: '#4f46e5' }}>
            {t.buttonText}
          </button>
        )}
      </div>
    </nav>
  );
};

const LoginPage = ({ lang, translations }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const t = translations[lang] || translations['en'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      login({ email, id: Date.now() });
    }
  };

  return (
    <div style={pageStyle}>
      <h2>{t.title}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder={t.placeholderEmail} 
          style={inputStyle} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit" style={submitBtnStyle}>{t.buttonText}</button>
      </form>
    </div>
  );
};

function App() {
  const [lang, setLang] = useState('az');

  const translations = {
    az: { title: "Sistemə Giriş", placeholderUser: "İstifadəçi adı", placeholderEmail: "Email", buttonText: "Daxil ol" },
    en: { title: "Login to System", placeholderUser: "Username", placeholderEmail: "Email", buttonText: "Sign In" }
  };

  return (
    <Router>
      <AuthProvider>
        {/* Navbar indi AuthProvider daxilindədir, hook-lar işləyəcək */}
        <Navbar lang={lang} setLang={setLang} translations={translations} />
        <Routes>
          <Route path="/" element={<div style={pageStyle}><h1>Home Page</h1></div>} />
          <Route path="/login" element={<LoginPage lang={lang} translations={translations} />} />
          <Route path="/start" element={<div style={pageStyle}><h1>Start Page Content</h1></div>} />
          <Route path="/create" element={<div style={pageStyle}><h1>Create Page Content</h1></div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Styles
const navBtnStyle = { margin: '0 5px', padding: '10px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' };
const langBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', margin: '0 5px', fontWeight: 'bold' };
const authBtnStyle = { color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' };
const inputStyle = { padding: '12px', margin: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ddd' };
const submitBtnStyle = { padding: '12px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const pageStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' };

export default App;