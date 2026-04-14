import React, { useState } from 'react';

function App() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Backend-ə sorğu göndəririk
    const response = await fetch('http://localhost:5005/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, email: email })
    });

    const data = await response.json();
    setMessage(data.message); // Backend-dən gələn "Qeydiyyat uğurla tamamlandı!" mesajı
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>Learnihub Qeydiyyat</h1>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="İstifadəçi adı" 
          onChange={(e) => setUserName(e.target.value)} 
          style={{ padding: '10px', margin: '5px' }}
        />
        <br />
        <input 
          type="email" 
          placeholder="Email ünvanı" 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '10px', margin: '5px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none' }}>
          Qeydiyyatdan keç
        </button>
      </form>
      
      {message && <p style={{ color: 'blue', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default App;