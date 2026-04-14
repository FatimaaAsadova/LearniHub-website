import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("text-change", (data) => {
      setText(data);
    });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("text-change", e.target.value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Real-time Editor</h2>

      <textarea
        style={{ width: "400px", height: "200px" }}
        value={text}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;