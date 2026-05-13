import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient"; // Supabase konfiqurasiyası

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Girişdən sonra hara yönlənməli olduğunu yoxlayırıq
  const from = localStorage.getItem('redirectAfterLogin') || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        setMessage({ text: "Giriş uğurludur! Yönləndirilirsiniz...", type: "success" });
        
        // redirectAfterLogin dəyərini təmizləyirik
        localStorage.removeItem('redirectAfterLogin');

        // İstifadəçini əvvəl kliklədiyi səhifəyə göndəririk
        setTimeout(() => {
          window.location.href = from;
        }, 1500);
      }
    } catch (error) {
      setMessage({ text: "Xəta: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "Qeydiyyat uğurludur! E-poçtunuzu yoxlayın.", type: "success" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Learnihub</h2>
          <p className="mt-2 text-sm text-gray-500">Hesabınıza daxil olun</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="nümunə@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Şifrə</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-black uppercase tracking-widest rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? "Gözləyin..." : "DAXİL OL"}
            </button>
            
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full flex justify-center py-3 px-4 border border-gray-200 text-xs font-black uppercase tracking-widest rounded-xl text-gray-600 bg-white hover:bg-gray-50 transition-all"
            >
              QEYDİYYATDAN KEÇ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;