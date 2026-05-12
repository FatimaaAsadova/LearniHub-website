/**
 * Authentication Module — Learnihub
 */

const SESSION_STORAGE_KEY = 'loggedInUser';

/**
 * Giriş funksiyası (login.html üçün)
 * Supabase auth istifadə edərək giriş edir və yönləndirməni idarə edir.
 */
async function login(email, pass) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: pass,
        });

        if (error) throw error;

        // Sessiyanı yadda saxla
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));

        // Hədəf səhifəni yoxla, yoxdursa birbaşa courses.html-ə göndər
        const targetPage = localStorage.getItem('redirectAfterLogin') || 'courses.html';
        localStorage.removeItem('redirectAfterLogin');

        setTimeout(() => {
            window.location.href = targetPage;
        }, 500);

        return { success: true, data: data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Qeydiyyat funksiyası (register.html üçün)
 */
async function register(email, pass) {
    if (email.length < 3 || pass.length < 6) {
        return { success: false, message: "Email (min. 3) və ya şifrə (min. 6) qısadır!" };
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: pass,
        });

        if (error) throw error;
        
        const targetPage = localStorage.getItem('redirectAfterLogin') || 'index.html';
        localStorage.removeItem('redirectAfterLogin');
        
        return { success: true, data: data, redirectTo: targetPage };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Çıxış funksiyası
 * Həm Supabase sessiyasını, həm də LocalStorage-i təmizləyir.
 */
async function logout() {
    try {
        if (typeof supabaseClient !== 'undefined') {
            await supabaseClient.auth.signOut();
        }
    } catch (err) {
        console.error("Logout error:", err);
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = 'index.html';
}

/**
 * Mühafizə olunan naviqasiya funksiyası
 */
function protectedNavigate(targetUrl) {
    if (localStorage.getItem(SESSION_STORAGE_KEY)) {
        window.location.href = targetUrl;
    } else {
        localStorage.setItem('redirectAfterLogin', targetUrl);
        window.location.href = 'login.html';
    }
}

/**
 * Xəta mesajlarını göstərmək üçün köməkçi funksiya
 */
function showError(msg, color = "red") {
    const errorMessage = document.getElementById('message') || document.getElementById('loginMessage');
    if (errorMessage) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        errorMessage.className = `p-3 rounded-xl text-xs font-semibold text-center bg-${color}-50 text-${color}-600 block mb-4`;
    }
}

/**
 * Səhifə yüklənəndə düymələrin klik hadisələrini izləyir.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Logout düyməsi üçün
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Dinamik yönləndirmə hədəflərini təyin edən düymələr
    const setupBtn = (btnId, targetUrl) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                protectedNavigate(targetUrl);
            });
        }
    };

    // Düymə ID-lərinə əsasən hədəf səhifələri bağlayırıq
    setupBtn('coursesBtn', 'courses.html');      
    setupBtn('dashboardBtn', 'courses.html');    
    setupBtn('surveyBtn', 'survey.html');       
    setupBtn('submitCourseBtn', 'survey.html'); 
});