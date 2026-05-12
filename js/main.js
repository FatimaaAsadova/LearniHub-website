// --- main.js (FULL OPTIMIZED VERSION WITH AUTH REDIRECT) ---

const translations = {
    az: {
        navHome: "Ana Səhifə",
        navCourse: "Kurslar",
        navSubmit: "Sorğu",
        navLogin: "Daxil Ol",
        navRegister: "Qeydiyyat",
        heroTitle: "Öz biliklərini paylaş — yeni kurslar əlavə et",
        heroDesc: "Kurslar, proqramlar və təhsil resurslarını paylaşmaq üçün platformamızdan istifadə et.",
        heroBtn: "Kurslara bax",
        servicesTitle: "Xidmətlərimiz",
        loginTitle: "Giriş",
        loginEmail: "E-poçt ünvanı",
        loginPass: "Şifrə",
        registerTitle: "Hesab Yaradın",
        registerName: "Tam adınız",
        submitTitle: "Kurs Təqdimatı",
        courseName: "KURSUN ADI",
        category: "KATEQORİYA",
        format: "KURS FORMATI",
        link: "KURS LİNKİ",
        desc: "TƏSVİR",
        btnSend: "Göndər",
        btnLogout: "Çıxış"
    },
    en: {
        navHome: "Home Page",
        navCourse: "Courses",
        navSubmit: "Submit Course",
        navLogin: "Login",
        navRegister: "Sign Up",
        heroTitle: "Share your knowledge — add new courses",
        heroDesc: "Use our platform to share courses, programs, and educational resources.",
        heroBtn: "View Courses",
        servicesTitle: "Our Services",
        loginTitle: "Sign In",
        loginEmail: "Email Address",
        loginPass: "Password",
        registerTitle: "Create Account",
        registerName: "Full Name",
        submitTitle: "Course Submission",
        courseName: "COURSE NAME",
        category: "CATEGORY",
        format: "COURSE FORMAT",
        link: "COURSE LINK",
        desc: "DESCRIPTION",
        btnSend: "Submit Course",
        btnLogout: "Logout"
    }
};

let currentLang = localStorage.getItem('learnihub_lang') || 'az';

// --- AUTH CHECKER ---
// Bu funksiya istifadəçinin daxil olub olmadığını yoxlayır (LocalStorage və ya Supabase session-dan asılı olaraq)
function isAuthenticated() {
    // Əgər auth.js-də başqa metod istifadə edirsənsə bura uyğunlaşdırıla bilər
    return localStorage.getItem('supabase.auth.token') || localStorage.getItem('user_session');
}

// 1. DİL DƏYİŞMƏ FUNKSİYASI
window.switchLanguage = function(lang) {
    console.log("Seçilən dil:", lang);
    currentLang = lang;
    localStorage.setItem('learnihub_lang', lang);
    
    // Bütün UI-ni (navbar və məzmun) yeniləyirik
    updateNavbarUI();
    const hash = window.location.hash.substring(1) || 'home';
    window.navigate(hash);
};

// 2. NAVİQASİYA (SPA MƏNTİQİ)
window.navigate = function(path) {
    // Qorumalı səhifələr (Courses və Submit/Survey)
    if ((path === 'courses' || path === 'submit') && !isAuthenticated()) {
        // Hara getmək istədiyini yadda saxla
        localStorage.setItem('redirectAfterLogin', path);
        window.history.pushState({}, '', `#login`);
        displayLogin();
        return;
    }

    window.history.pushState({}, '', `#${path}`);
    
    // Hansı səhifədəyiksə, oranı render edirik
    switch(path) {
        case 'home': displayHome(); break;
        case 'login': displayLogin(); break;
        case 'register': displayRegister(); break;
        case 'submit': displaySubmit(); break;
        case 'courses': displayCourses(); break; // Kurslar funksiyası əlavə olundu
        default: displayHome();
    }
};

// 3. SƏHİFƏ RENDER FUNKSİYALARI
function getArea() { return document.getElementById('mainContentArea'); }

function displayHome() {
    const area = getArea(); if (!area) return;
    const t = translations[currentLang];
    area.innerHTML = `
        <section class="p-10 text-center bg-gray-50">
            <h2 class="text-4xl font-bold text-indigo-900">${t.heroTitle}</h2>
            <p class="mt-4 text-gray-600">${t.heroDesc}</p>
            <button onclick="window.navigate('courses')" class="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                ${t.heroBtn}
            </button>
        </section>`;
}

function displayLogin() {
    const area = getArea(); if (!area) return;
    const t = translations[currentLang];
    area.innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-2xl font-bold mb-6 text-center">${t.loginTitle}</h2>
            <label class="block mb-2 text-sm font-medium">${t.loginEmail}</label>
            <input id="loginEmailField" type="email" class="w-full p-2 border rounded mb-4" placeholder="you@example.com">
            <label class="block mb-2 text-sm font-medium">${t.loginPass}</label>
            <input id="loginPassField" type="password" class="w-full p-2 border rounded mb-6" placeholder="******">
            <button onclick="handleManualLogin()" class="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">${t.navLogin}</button>
        </div>`;
}

// Login olduqdan sonra yönləndirmə funksiyası
window.handleManualLogin = function() {
    // Burada sənin auth.js-dəki login məntiqin işə düşməlidir. 
    // Simulyasiya üçün uğurlu girişdən sonra:
    const target = localStorage.getItem('redirectAfterLogin') || 'home';
    localStorage.removeItem('redirectAfterLogin');
    window.navigate(target);
};

function displayRegister() {
    const area = getArea(); if (!area) return;
    const t = translations[currentLang];
    area.innerHTML = `
        <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-2xl font-bold mb-6 text-center">${t.registerTitle}</h2>
            <label class="block mb-2 text-sm font-medium">${t.registerName}</label>
            <input type="text" class="w-full p-2 border rounded mb-4" placeholder="Fatima Asadova">
            <label class="block mb-2 text-sm font-medium">${t.loginEmail}</label>
            <input type="email" class="w-full p-2 border rounded mb-4" placeholder="you@example.com">
            <button class="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">${t.navRegister}</button>
        </div>`;
}

function displaySubmit() {
    const area = getArea(); if (!area) return;
    const t = translations[currentLang];
    area.innerHTML = `
        <div class="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow">
            <h2 class="text-3xl font-bold mb-6 text-indigo-700">${t.submitTitle}</h2>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-xs font-bold mb-2">${t.courseName} *</label><input class="w-full border p-2 rounded"></div>
                <div><label class="block text-xs font-bold mb-2">${t.category} *</label><select class="w-full border p-2 rounded"><option>Mathematics</option></select></div>
            </div>
            <button class="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold uppercase">${t.btnSend}</button>
        </div>`;
}

function displayCourses() {
    const area = getArea(); if (!area) return;
    const t = translations[currentLang];
    area.innerHTML = `<div class="p-10 text-center"><h2 class="text-3xl font-bold">${t.navCourse}</h2><p class="mt-4">Burada kursların siyahısı olacaq.</p></div>`;
}

// 4. NAVBAR VƏ DİL DÜYMƏLƏRİ
function updateNavbarUI() {
    const t = translations[currentLang];
    
    const elements = {
        'navHome': t.navHome,
        'navCourse': t.navCourse,
        'navSubmit': t.navSubmit,
        'navLogin': t.navLogin,
        'navRegister': t.navRegister,
        'logoutText': t.btnLogout
    };

    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    }

    // Aktiv dilin rəngi
    const btnAz = document.getElementById('btnAz');
    const btnEn = document.getElementById('btnEn');
    if (btnAz) btnAz.classList.toggle('text-indigo-600', currentLang === 'az');
    if (btnEn) btnEn.classList.toggle('text-indigo-600', currentLang === 'en');
}

// 5. BAŞLANĞIÇ
window.onload = () => {
    const hash = window.location.hash.substring(1) || 'home';
    updateNavbarUI();
    window.navigate(hash);
};

window.onpopstate = () => {
    const hash = window.location.hash.substring(1) || 'home';
    window.navigate(hash);
};