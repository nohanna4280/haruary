import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Splash from "./Splash";
import Hmain from "./Hmain";
import Rg from "./Rg";
import "./css/hmain.css";
import "./app.css";

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  if (!loadingDone) {
    return (
      <div className="app-wrapper">
        <Splash onFinish={() => setLoadingDone(true)} />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Hmain />} />
        <Route path="/rg" element={<Rg />} />
      </Routes>
    </div>
  );
}
