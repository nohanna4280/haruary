import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/hmain.css";
import sortIcon from "./assets/sort.svg";

export default function Hmain() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="hmain-wrapper">
      {/* 정렬 버튼 */}
      <button className="sort-btn">
        <img src={sortIcon} alt="sort" className="sort-icon" />
      </button>

      {/* 카테고리 */}
      <div className="fab-wrapper">
        {openMenu && (
          <div className="fab-menu">
            <button className="fab-menu1" onClick={() => navigate("/rg")}>등록</button>
            <button className="fab-menu2">갤러리</button>
            <button className="fab-menu3">?</button>
          </div>
        )}

        {/* + 버튼 */}
        <button
          className="fab-btn"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          +
        </button>
      </div>
    </div>
  );
}
