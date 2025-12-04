import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/hmain.css";
import sortIcon from "./assets/sort.svg";

export default function Hmain({ diaries }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [sortType, setSortType] = useState("latest");
  const navigate = useNavigate();

  const monthColors = {
    "01": "#EABFBF",
    "02": "#F3D7BF",
    "03": "#E8DEC4",
    "04": "#B3CA89",
    "05": "#B1E3CF",
    "06": "#9FD5B4",
    "07": "#BAD8F0",
    "08": "#A1B9D5",
    "09": "#C6C4EA",
    "10": "#E0C0E6",
    "11": "#F3BED9",
    "12": "#DBD0CB"
  };

  // 날짜 안전 파싱 함수
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0); // 잘못된 날짜는 가장 오래된 날짜로 처리
    const onlyDate = dateStr.split(" ")[0]; // "2025.12.03"
    const parts = onlyDate.split(".");
    if (parts.length !== 3) return new Date(0);
    return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  };

  // 정렬
  const sortedDiaries = [...diaries].sort((a, b) => {
    const A = parseDate(a.date);
    const B = parseDate(b.date);

    if (sortType === "latest") return B - A;
    if (sortType === "oldest") return A - B;
    if (sortType === "title") return (a.title || "").localeCompare(b.title || "");

    return 0;
  });

  return (
    <div className="hmain-wrapper">

      <button className="sort-btn" onClick={() => setShowSortPopup(true)}>
        <img src={sortIcon} alt="sort" className="sort-icon" />
      </button>

      {/* ===== 일기 카드 ===== */}
      <div className="diary-wrapper">
        {sortedDiaries.map((d) => {
          const dateStr = d.date || "";
          const month = dateStr.split(".")[1] || "01";

          // 안전한 이미지 선택
          const firstImage = d.images?.find(img => img) || "";

          return (
            <div
              key={d.id}
              className="diary-card"
              style={{ backgroundColor: monthColors[month] }}
              onClick={() => navigate(`/edit/${d.id}`)}
            >
              <div className="diary-thumb">
                {firstImage ? (
                  <img src={firstImage} className="thumb-img" alt="thumb" />
                ) : (
                  <div className="thumb-placeholder"></div>
                )}
              </div>

              <div className="card-title">{d.title || "(제목 없음)"}</div>
              <div className="card-date">{d.date}</div>
            </div>
          );
        })}
      </div>

      {/* ===== 플로팅 버튼 ===== */}
      <div className="fab-wrapper">
        {openMenu && (
          <div className="fab-menu">
            <button className="fab-menu1" onClick={() => navigate("/rg")}>등록</button>
            <button className="fab-menu2">갤러리</button>
            <button className="fab-menu3">?</button>
          </div>
        )}

        <button className="fab-btn" onClick={() => setOpenMenu(prev => !prev)}>+</button>
      </div>

      {/* ===== 정렬 팝업 ===== */}
      {showSortPopup && (
        <div className="popup-overlay" onClick={() => setShowSortPopup(false)}>
          <div className="sort-popup" onClick={(e) => e.stopPropagation()}>
            <button className="sort-option" onClick={() => { setSortType("latest"); setShowSortPopup(false); }}>
              최신순
            </button>
            <button className="sort-option" onClick={() => { setSortType("oldest"); setShowSortPopup(false); }}>
              오래된순
            </button>
            <button className="sort-option" onClick={() => { setSortType("title"); setShowSortPopup(false); }}>
              제목순
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
