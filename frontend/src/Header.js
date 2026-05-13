import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dil vəziyyətini idarə etmək üçün
  const [lang, setLang] = useState(localStorage.getItem('preferredLang') || 'en');

  // Dil dəyişəndə həm state-i, həm də localStorage-i yeniləyirik
  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('preferredLang', newLang);
    document.documentElement.lang = newLang;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Qorumalı keçid funksiyası (React üçün)
  const protectedNavigate = (targetPath) => {
    if (user) {
      navigate(targetPath);
    } else {
      // Girişdən sonra yönləndiriləcək səhifəni yadda saxlayırıq
      localStorage.setItem('redirectAfterLogin', targetPath);
      navigate('/login');
    }
  };

  // Tərcümə obyektləri (UI üçün)
  const t = {
    az: {
      home: "ANA SƏHİFƏ", courses: "KURSLAR", survey: "SORĞU",
      login: "DAXİL OL", logout: "ÇIXIŞ"
    },
    en: {
      home: "HOME", courses: "COURSES", survey: "SURVEY",
      login: "SIGN IN", logout: "LOGOUT"
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        
        {/* Logo və Naviqasiya */}
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
            Learnihub
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
            <Link to="/" className="hover:text-indigo-600 transition-colors">{t[lang].home}</Link>
            
            {/* Qorumalı keçidlər */}
            <button 
              onClick={() => protectedNavigate('/courses')} 
              className="hover:text-indigo-600 transition-colors uppercase"
            >
              {t[lang].courses}
            </button>
            <button 
              onClick={() => protectedNavigate('/survey')} 
              className="hover:text-indigo-600 transition-colors uppercase"
            >
              {t[lang].survey}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Dil Seçimi */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter border-r pr-6 border-gray-100">
            <button 
              onClick={() => switchLanguage('az')} 
              className={`px-2 py-1 rounded-md transition-all ${lang === 'az' ? 'text-indigo-600 bg-white shadow-sm font-extrabold' : 'hover:text-indigo-600'}`}
            >
              AZ
            </button>
            <span className="text-gray-200">/</span>
            <button 
              onClick={() => switchLanguage('en')} 
              className={`px-2 py-1 rounded-md transition-all ${lang === 'en' ? 'text-indigo-600 bg-white shadow-sm font-extrabold' : 'hover:text-indigo-600'}`}
            >
              EN
            </button>
          </div>

          {/* Auth Area */}
          <div id="authArea" className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-6 py-2.5 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 font-bold text-xs uppercase tracking-widest transition-all"
                >
                  {t[lang].logout}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-100"
              >
                {t[lang].login}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;