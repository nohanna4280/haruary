import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/rg.css";
import check from "./assets/check.svg";
import delete1 from "./assets/delete.svg";
import CalendarModal from "./CalendarModal";

export default function Edit({ diaries, updateDiary, deleteDiary }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const diary = diaries.find((d) => d.id === Number(id));

    // 초기값 세팅
    const [selectedDate, setSelectedDate] = useState(diary?.date || "");
    const [images, setImages] = useState(diary?.images || [null, null, null, null]);
    const [title, setTitle] = useState(diary?.title || "");
    const [content, setContent] = useState(diary?.content || "");

    const [deleteTarget, setDeleteTarget] = useState(null); // 이미지 삭제용
    const [showDeletePopup, setShowDeletePopup] = useState(false); // 일기 전체 삭제용

    const [dateModal, setDateModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = dateModal ? "hidden" : "";
  }, [dateModal]);

    // 이미지 업로드(base64)
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


    // 수정 저장
    const handleSave = () => {
        const updated = {
            ...diary,
            date: selectedDate,
            title,
            content,
            images,
        };

        updateDiary(updated);
        navigate("/");
    };

    // 삭제 기능
    const handleDelete = () => {
        deleteDiary(diary.id);
        navigate("/");
    };

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

                {/* 삭제 버튼 */}
                <button className="delete-btn1" onClick={() => setShowDeletePopup(true)}>
                    <img src={delete1} alt="delete" className="delete-icon1" />
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

            {/* 이미지 영역 */}
            <div className="image-grid">
                {images.map((img, index) => {
                    const isPlusSpot = index === images.findIndex((i) => i === null);

                    return (
                        <div key={index} className="img-box">
                            {img && (
                                <div className="img-container">
                                    <img
                                        src={img}
                                        alt={`img-${index}`}
                                        className="img-photo"
                                        onClick={() => setDeleteTarget(index)}
                                    />

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

            {/* 제목 / 내용 */}
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


            {showDeletePopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <button
                            className="popup-delete-btn"
                            onClick={() => {
                                deleteDiary(diary.id);
                                navigate("/");
                            }}
                        >
                            일기 삭제
                        </button>

                        <button
                            className="popup-cancel-btn"
                            onClick={() => setShowDeletePopup(false)}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
