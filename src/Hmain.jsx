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


  // 날짜 자동 정렬: 최신순(가장 최근 → 위로)
  const sortedDiaries = [...diaries].sort((a, b) => {
    const dateA = new Date(a.date.split(" ")[0]);
    const dateB = new Date(b.date.split(" ")[0]);

    if (sortType === "latest") return dateB - dateA;
    if (sortType === "oldest") return dateA - dateB;
    if (sortType === "title") return a.title.localeCompare(b.title);

    return 0;
  });
  
  return (
    <div className="hmain-wrapper">

      <button className="sort-btn" onClick={() => setShowSortPopup(true)}>
        <img src={sortIcon} alt="sort" className="sort-icon" />
      </button>

      {/* 일기 카드 */}
      <div className="diary-wrapper">
        {sortedDiaries.map((d) => {
          const month = d.date.split(".")[1];

          return (
            <div
              key={d.id}
              className="diary-card"
              style={{ backgroundColor: monthColors[month] }}
              onClick={() => navigate(`/edit/${d.id}`)}
            >
              <img src={d.images[0]} className="thumb-img" />
              <div className="card-title">{d.title}</div>
              <div className="card-date">{d.date}</div>
            </div>
          );
        })}
      </div>


      {/* 플로팅 버튼 */}
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

      {showSortPopup && (
        <div className="popup-overlay" onClick={() => setShowSortPopup(false)}>
          <div className="sort-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="sort-option"
              onClick={() => {
                setSortType("latest");
                setShowSortPopup(false);
              }}
            >
              최신순
            </button>
            <button
              className="sort-option"
              onClick={() => {
                setSortType("oldest");
                setShowSortPopup(false);
              }}
            >
              오래된순
            </button>
            <button
              className="sort-option"
              onClick={() => {
                setSortType("title");
                setShowSortPopup(false);
              }}
            >
              제목순
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
