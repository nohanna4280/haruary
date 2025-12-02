// 로딩 화면 페이지 (발바닥)
import { useEffect } from "react";
import "./css/splash.css";
import foot from "./assets/foot.svg"; // 발바닥 이미지 svg

console.log(foot);

export default function Splash({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2초 유지

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="splash-wrapper">
      <img src={foot} className="foot-img" />
    </div>
  );
}