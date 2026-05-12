import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { supabase } from "./supabaseClient"; // Supabase konfiqurasiyanı bura import et

const socket = io("http://localhost:5000");

function App() {
  const [text, setText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // BURANI DƏYİŞ: Öz email ünvanını yaz
  const ADMIN_EMAIL = "senin-emailin@gmail.com";

  useEffect(() => {
    // 1. Socket.io quraşdırması
    socket.on("text-change", (data) => {
      setText(data);
    });

    // 2. Admin və Giriş yoxlaması (Supabase Auth)
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email);
        if (user.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUser();

    return () => socket.off("text-change");
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setText(newValue);
    socket.emit("text-change", newValue);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleProtectedAction = (path) => {
    if (!isLoggedIn) {
      // Giriş etməyibsə login səhifəsinə göndər və hədəfi yadda saxla
      localStorage.setItem('redirectAfterLogin', path);
      window.location.href = "/login.html";
    } else {
      window.location.href = path;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Simulyasiyası */}
      <aside style={{ width: "250px", borderRight: "1px solid #ddd", padding: "20px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ color: "#4f46e5" }}>Learnihub</h2>
        <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => handleProtectedAction("/courses")} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "5px 0" }}>My Courses</button>
          <button onClick={() => handleProtectedAction("/survey")} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "5px 0" }}>Submit Course</button>
          
          {/* ANCAQ ADMİNDƏ GÖRÜNƏN HİSSƏ */}
          {isAdmin && (
            <a href="/admin.html" style={{ fontWeight: "bold", color: "indigo", textDecoration: "none" }}>
              Admin Panel
            </a>
          )}
          
          <a href="/" style={{ textDecoration: "none", color: "black" }}>Home Page</a>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #eee" }}>
          {isLoggedIn ? (
            <>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>{userEmail}</p>
              <button 
                onClick={handleLogout} 
                style={{ color: "red", cursor: "pointer", border: "none", background: "none", fontWeight: "bold", padding: 0 }}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => window.location.href = "/login.html"} 
              style={{ color: "#4f46e5", cursor: "pointer", border: "none", background: "none", fontWeight: "bold", padding: 0 }}
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 40, backgroundColor: "#f9fafb" }}>
        <h2>Real-time Editor</h2>
        <textarea
          style={{ width: "100%", maxWidth: "600px", height: "300px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          value={text}
          onChange={handleChange}
        />
        {!isAdmin && <p style={{ marginTop: "10px", color: "gray" }}>Qeyd: Admin deyilsiniz, bəzi menyular gizlədilib.</p>}
      </main>
    </div>
  );
}

export default App;