import { useState, useEffect } from "react";
import "./css/rg.css";
import { useNavigate } from "react-router-dom";
import close from "./assets/close.svg";
import check from "./assets/check.svg";
import CalendarModal from "./CalendarModal.jsx";

export default function Rg({ addDiary }) {
  const navigate = useNavigate();

  // 현재 날짜
  const [selectedDate, setSelectedDate] = useState("");

  // 이미지 배열 (4칸)
  const [images, setImages] = useState([null, null, null, null]);

  // 이미지 삭제
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [dateModal, setDateModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = dateModal ? "hidden" : "";
  }, [dateModal]);
  // 이미지 업로드 처리
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 압축 후 base64 받기
    const compressed = await compressImage(file);

    setImages((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((i) => i === null);
      if (idx !== -1) copy[idx] = compressed;
      return copy;
    });
  };


  const handleSave = () => {
    const diary = {
      id: Date.now(),
      date: selectedDate,
      title,
      content,
      images
    };

    addDiary(diary);
    navigate("/");
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

  // 이미지 압축 + base64 변환
  const compressImage = (file, maxWidth = 900, quality = 0.6) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          // 비율 유지
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // 압축된 이미지 base64
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

          resolve(compressedBase64);
        };
      };
    });


  return (
    <div className={`register-wrapper ${dateModal ? "lock-scroll" : ""}`}>
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
        <button className="check-btn" onClick={handleSave}>
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
        <input
          className="title-input"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="content-input"
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}