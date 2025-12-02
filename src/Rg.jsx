import { useState, useEffect } from "react";
import "./css/rg.css";
import { useNavigate } from "react-router-dom";
import close from "./assets/close.svg";
import check from "./assets/check.svg";
import CalendarModal from "./CalendarModal.jsx";

export default function Register() {
  const navigate = useNavigate();

  // 모달 열림 상태
  const [dateModal, setDateModal] = useState(false);
  // 현재 날짜
  const [selectedDate, setSelectedDate] = useState("");

  // 이미지 배열 (4칸)
  const [images, setImages] = useState([null, null, null, null]);

  // 이미지 삭제
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);

    setImages((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((i) => i === null); // 첫 빈 칸 찾기

      if (idx !== -1) copy[idx] = imgURL;
      return copy;
    });
  };

  // 오늘 날짜 초기 설정
  useEffect(() => {
    const today = new Date();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const text = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
      today.getDate()
    ).padStart(2, "0")} ${dayNames[today.getDay()]}요일`;
    setSelectedDate(text);
  }, []);

  return (
    <div className="register-wrapper">
      {/* 상단바 */}
      <div className="register-topbar">
        {/* X 버튼 */}
        <button className="close-btn" onClick={() => navigate(-1)}>
          <img src={close} alt="close" className="close-icon" />
        </button>

        {/* 날짜 */}
        <div className="topbar-date" onClick={() => setDateModal(true)}>
          {selectedDate}
        </div>

        {/* 체크 버튼 */}
        <button className="check-btn">
          <img src={check} alt="check" className="check-icon" />
        </button>
      </div>
      
      {/* 날짜 모달 */}
      {dateModal && (
        <CalendarModal
          currentSelected={selectedDate}
          onClose={() => setDateModal(false)}
          onConfirm={(newDate) => {
            setSelectedDate(newDate);
            setDateModal(false);
          }}
        />
      )}

      <div className="image-grid">
  {images.map((img, index) => {
    const isPlusSpot = index === images.findIndex(i => i === null);

    return (
      <div key={index} className="img-box">

        {/* 이미지 있을 때 */}
        {img && (
          <div className="img-container">
            <img
              src={img}
              alt={`img-${index}`}
              className="img-photo"
              onClick={() => setDeleteTarget(index)}
            />

            {/* 삭제 버튼 오버레이 */}
            {deleteTarget === index && (
              <div className="delete-overlay">
                <button
                  className="delete-btn"
                  onClick={() => {
                    const copy = [...images];
                    copy[index] = null;
                    setImages(copy);
                    setDeleteTarget(null);
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}

        {/* 플러스 버튼: 첫 null 칸에만 노출 */}
        {!img && isPlusSpot && (
          <label className="plus-btn">
            +
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}

      </div>
    );
  })}
</div>
      {/* 제목 + 내용 입력 */}
      <div className="text-area">
        <input className="title-input" placeholder="제목을 입력하세요." />
        <textarea
          className="content-input"
          placeholder="내용을 입력하세요..."
        ></textarea>
      </div>
    </div>
  );
}