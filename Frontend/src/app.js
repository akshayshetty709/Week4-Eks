import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(() => setMessage("Error connecting backend"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚀 3-Tier DevOps Project deployed through EKS</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
