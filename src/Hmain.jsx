import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/hmain.css";
import sortIcon from "./assets/sort.svg";

export default function Hmain({ diaries }) {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="hmain-wrapper">

      <button className="sort-btn">
        <img src={sortIcon} alt="sort" className="sort-icon" />
      </button>

      {/* 일기 카드 */}
      <div className="diary-wrapper">
        {diaries.map((d) => (
          <div
            key={d.id}
            className="diary-card"
            onClick={() => navigate(`/edit/${d.id}`)}
          >
            <img src={d.images[0]} className="thumb-img" />
            <div className="card-title">{d.title}</div>
            <div className="card-date">{d.date}</div>
          </div>
        ))}
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

    </div>
  );
}

