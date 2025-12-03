import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Splash from "./Splash";
import Hmain from "./Hmain";
import Rg from "./Rg";
import "./css/hmain.css";
import "./App.css";
import Edit from "./Edit.jsx";

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [diaries, setDiaries] = useState(null);  // ★ null로 변경 (중요!)

  // localStorage에서 읽기 (Splash보다 먼저 실행됨)
  useEffect(() => {
    const saved = localStorage.getItem("haruary_diaries");
    if (saved) {
      setDiaries(JSON.parse(saved));
    } else {
      setDiaries([]);   // 저장된 게 없으면 빈 배열
    }
  }, []);

  // diaries 저장
  useEffect(() => {
    if (diaries !== null) {
      localStorage.setItem("haruary_diaries", JSON.stringify(diaries));
    }
  }, [diaries]);

  const addDiary = (newDiary) => {
    setDiaries(prev => [newDiary, ...prev]);
  };

  // diaries가 null이면 아직 로딩 중 → Splash보다 먼저 데이터 준비됨
  if (diaries === null) {
    return null;  // 완전 로딩 중
  }

  // Splash 단계
  if (!loadingDone) {
    return (
      <div className="app-wrapper">
        <Splash onFinish={() => setLoadingDone(true)} />
      </div>
    );
  }

  const updateDiary = (updated) => {
    setDiaries(prev =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  const deleteDiary = (id) => {
    setDiaries(prev => prev.filter(d => d.id !== id));
  };


  <Route
    path="/edit/:id"
    element={
      <Edit
        diaries={diaries}
        updateDiary={updateDiary}
        deleteDiary={deleteDiary}
      />
    }
  />


  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Hmain diaries={diaries} />} />
        <Route path="/rg" element={<Rg addDiary={addDiary} />} />

        {/* 수정 페이지 */}
        <Route
          path="/edit/:id"
          element={
            <Edit
              diaries={diaries}
              updateDiary={updateDiary}
              deleteDiary={deleteDiary}
            />
          }
        />
      </Routes>
    </div>
  );
}
