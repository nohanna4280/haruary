import { useState, useEffect } from "react";
import "./css/calendar.css";
import check from "./assets/check.svg";
import foot from "./assets/foot.svg";

export default function CalendarModal({ currentSelected, onClose, onConfirm }) {
  const today = new Date();

  // 현재 모달에서 보여줄 연/월
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11

  // 모달 내부에서 임시로 선택한 날짜 (✓ 눌러야 적용됨)
  const [tempSelected, setTempSelected] = useState(null);

  // 모달이 열릴 때 현재 선택된 날짜 반영
  useEffect(() => {
    if (!currentSelected) return;

    // "2025.01.13 월요일" 형태 → 날짜 부분만 split
    const [y, m, d] = currentSelected.split(" ")[0].split(".");
    setYear(Number(y));
    setMonth(Number(m) - 1);
    setTempSelected(Number(d));
  }, [currentSelected]);

  // 월 이동
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // 날짜 계산
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  // 달력 배열 생성
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= lastDay; d++) days.push(d);

  // 날짜 텍스트 변환 함수
  const formatDate = (y, m, d) => {
    const dateObj = new Date(y, m, d);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${y}.${String(m + 1).padStart(2, "0")}.${String(d).padStart(2, "0")} ${
      dayNames[dateObj.getDay()]
    }요일`;
  };

  return (
    <div className="calendar-dim">
      <div className="calendar-sheet">

        {/* 상단 헤더 */}
        <div className="cal-header">
          <button onClick={prevMonth}>
            <img src={foot} alt="foot" className="foot1-icon" />
          </button>
          <span>{year}년 {month + 1}월</span>
          <button onClick={nextMonth}>
            <img src={foot} alt="foot" className="foot1-icon" />
          </button>
        </div>

        {/* 요일 */}
        <div className="cal-week">
          <span className="sun">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="sat">토</span>
        </div>

        {/* 날짜 */}
        <div className="cal-grid">
          {days.map((d, i) =>
            d === null ? (
              <div key={i} className="empty"></div>
            ) : (
              <div
                key={i}
                className={`cal-day ${tempSelected === d ? "selected" : ""}`}
                onClick={() => setTempSelected(d)}
              >
                {d}
              </div>
            )
          )}
        </div>

        {/* ✓ 버튼 */}
        <button
          className="cal-confirm"
          onClick={() => {
            if (tempSelected) {
              onConfirm(formatDate(year, month, tempSelected));
            } else {
              onClose();
            }
          }}
        >
          <img src={check} alt="check" className="check-icon" />
        </button>
      </div>
    </div>
  );
}
