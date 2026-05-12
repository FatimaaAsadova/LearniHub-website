// Toqquşmaların qarşısını almaq üçün translations obyektini window üzərində təyin edirik
window.translations = {
    az: {
        nav_home: "Ana Səhifə",
        nav_courses: "Kurslar",
        nav_survey: "Kurs Təklif Et",
        btn_signin: "Daxil Ol",
        btn_logout: "Çıxış",
        user_account: "İSTİFADƏÇİ HESABI",
        guest_text: "Qonaq",
        available_text: "Mövcud",
        courses_subtitle: "Kataloqdakı kursları araşdırın və süzgəcdən keçirin.",
        search_placeholder: "Kursun adını daxil edin...",
        filter_all: "Bütün Kateqoriyalar",
        cat_it: "İT və Mühəndislik",
        cat_math: "Riyaziyyat",
        cat_business: "Biznes",
        cat_arts: "İncəsənət və Dizayn",
        cat_general: "Ümumi",
        price_label: "Qiymət:",
        free_text: "Pulsuz",
        deadline_label: "Son tarix:",
        no_deadline: "Yoxdur",
        btn_reviews: "Rəylər",
        btn_view_course: "Keçid Et →",
        survey_title: "Kurs",
        survey_subtitle: "Təklifi",
        survey_desc: "İcma ilə paylaşmaq istədiyiniz təhsil resurslarını bura əlavə edin.",
        label_course_name: "KURSUN ADI *",
        label_category: "KATEQORİYA *",
        label_format: "KURS FORMATI *",
        label_deadline: "SON TARİX (OPSİONAL)",
        label_link: "KURS LİNKİ *",
        label_desc: "TƏSVİR",
        placeholder_course_name: "Məsələn: Modern JavaScript",
        placeholder_desc: "Kurs haqqında qısa məlumat...",
        btn_submit_course: "Məlumatı Göndər",
        back_to_courses: "Kurslara qayıt",
        reviews_title: "Rəylər",
        post_experience: "TƏCRÜBƏNİZİ PAYLAŞIN",
        placeholder_thoughts: "Kurs necə idi? Fikirlərinizi paylaşın...",
        btn_share: "Paylaş",
        community_feed: "İcma Rəyləri",
        live_activity: "CANLI AKTİVLİK",
        delete_btn: "SİL",
        confirm_delete: "Bu rəyi silmək istədiyinizə əminsiniz?",
        no_stories: "Hələ heç bir rəy yoxdur.",
        select_category: "Kateqoriya seçin"
    },
    en: {
        nav_home: "Home Page",
        nav_courses: "Courses",
        nav_survey: "Submit Course",
        btn_signin: "Login",
        btn_logout: "Logout",
        user_account: "USER ACCOUNT",
        guest_text: "Guest",
        available_text: "Available",
        courses_subtitle: "Explore and filter the courses in the catalog.",
        search_placeholder: "Enter course title...",
        filter_all: "All Categories",
        cat_it: "IT & Engineering",
        cat_math: "Mathematics",
        cat_business: "Business",
        cat_arts: "Arts & Design",
        cat_general: "General",
        price_label: "Price:",
        free_text: "Free",
        deadline_label: "Deadline:",
        no_deadline: "None",
        btn_reviews: "Reviews",
        btn_view_course: "View Course →",
        survey_title: "Course",
        survey_subtitle: "Submission",
        survey_desc: "Add educational resources you want to share with the community.",
        label_course_name: "COURSE NAME *",
        label_category: "CATEGORY *",
        label_format: "COURSE FORMAT *",
        label_deadline: "DEADLINE (OPTIONAL)",
        label_link: "COURSE LINK *",
        label_desc: "DESCRIPTION",
        placeholder_course_name: "e.g., Modern JavaScript",
        placeholder_desc: "Short information about the course...",
        btn_submit_course: "Submit Information",
        back_to_courses: "Kurslara qayıt",
        back_to_courses: "Back to Courses",
        reviews_title: "Feed",
        post_experience: "POST YOUR EXPERIENCE",
        placeholder_thoughts: "How was the course? Share your thoughts...",
        btn_share: "Share with Feed",
        community_feed: "Community Feed",
        live_activity: "LIVE ACTIVITY",
        delete_btn: "DELETE",
        confirm_delete: "Are you sure you want to delete this review?",
        no_stories: "No stories yet.",
        select_category: "Select Category"
    }
};

/**
 * Dil dəyişdirmə funksiyası
 * @param {string} lang - 'az' və ya 'en'
 */
window.switchLanguage = function(lang) {
    const t = window.translations[lang];
    if (!t) return;

    // 1. Ümumi mətnləri (textContent) və Input/Textarea placeholder-lərini dəyiş
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });

    // 2. Xüsusi placeholder atributu istifadə edənlər üçün (əgər varsa)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    // 3. Sidebar-dakı Dil düymələrinin vizual vəziyyəti
    const btnAz = document.getElementById('btnAz') || document.querySelector('button[onclick*="az"]');
    const btnEn = document.getElementById('btnEn') || document.querySelector('button[onclick*="en"]');
    
    if (btnAz && btnEn) {
        const activeClass = ['bg-indigo-600', 'text-white'];
        if (lang === 'az') {
            btnAz.classList.add(...activeClass);
            btnEn.classList.remove(...activeClass);
        } else {
            btnEn.classList.add(...activeClass);
            btnAz.classList.remove(...activeClass);
        }
    }

    // 4. Tercihi yadda saxla və HTML lang atributunu yenilə
    localStorage.setItem('preferredLang', lang);
    document.documentElement.lang = lang;

    // 5. Digər script-ləri (məs: courses.html) məlumatlandırmaq üçün event tetiklə
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

// Səhifə yüklənəndə yadda saxlanılmış dili tətbiq et
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    window.switchLanguage(savedLang);
});