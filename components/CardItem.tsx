import React, { CSSProperties, useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

interface CollectionItem {
  concertId: number;
  concertImage: string;
  concertName: string;
  concertDate: string;
  concertTime: string;
  collectedDate: string;
}

interface CardItemProps {
  collection: CollectionItem;
  isSelected: boolean;
  handleImageClick: (id: string) => void;
  zIndexState: { [key: string]: number };
}
const isMobile = () => {
  return window.innerWidth <= 768; // 768px 이하를 모바일로 간주
};
const CardItem: React.FC<CardItemProps> = ({
  collection,
  isSelected,
  handleImageClick,
  zIndexState,
}) => {
  const imageId = collection.concertId.toString();

  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  // useMotionValue 훅으로 rotateX와 rotateY를 관리합니다.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  // 빛 반사 효과를 위한 투명도 설정
  const overlayOpacity = useTransform(
    [rotateX, rotateY],
    ([latestX, latestY]: any) => {
      // 틸트 각도에 따라 투명도 계산 (예시: 각도가 커질수록 투명도 증가)
      const xOpacity = Math.abs(latestX) / 30;
      const yOpacity = Math.abs(latestY) / 30;
      return Math.min(xOpacity + yOpacity, 0.6); // 최대 투명도 0.6으로 제한
    }
  );

  useEffect(() => {
    setIsAnimating(true);
    if (isSelected) {
      controls
        .start({
          scale: 1.5,
          rotateY: [0, 360, 720],
          rotateX: [0, 15, -15, 10, -10, 0],
          rotateZ: [0, 5, -5, 5, -5, 0],
          transition: { duration: 1.5, ease: "easeInOut" },
        })
        .then(() => {
          setIsAnimating(false);
        });
    } else {
      controls
        .start({
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          transition: { duration: 1.5, ease: "easeInOut" },
        })
        .then(() => {
          setIsAnimating(false);
        });
    }
  }, [isSelected, controls]);

  // 마우스 이동 핸들러에서 rotateX와 rotateY 값을 업데이트합니다.
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // 요소 내에서의 X 좌표
    const y = e.clientY - rect.top; // 요소 내에서의 Y 좌표
    const newRotateY = (x / rect.width - 0.5) * 20;
    const newRotateX = (-(y / rect.height) + 0.5) * 20;
    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  };

  const handleMouseOut = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const collectedDateTime = new Date(collection.collectedDate);
  const collectedDate = collectedDateTime.toLocaleDateString();
  const collectedTime = collectedDateTime.toLocaleTimeString();

  return (
    <motion.div
      className="flex mb-4 justify-center items-center"
      style={{
        perspective: "1000px",
        overflow: "visible",
        position: "relative",
        zIndex: isSelected ? 999 : zIndexState[imageId] || 1,
      }}
    >
      <motion.div
        onClick={() => handleImageClick(collection.concertId.toString())}
        layout
        layoutId={`card-${imageId}`}
        animate={controls}
        style={{
        width: isSelected ? (isMobile() ? "15rem" : "36rem") : (isMobile() ? "18rem" : "24rem"),
        height: isSelected ? (isMobile() ? "7.5rem" : "18rem") : (isMobile() ? "10rem" : "12rem"),
          transformStyle: "preserve-3d",
          pointerEvents: isAnimating ? "none" : "auto",
          cursor: "pointer",
        }}
        className="flex rounded-md overflow-visible"
      >
        {/* 내부 motion.div를 추가하여 틸트 효과를 관리합니다. */}
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            rotateX: rotateX,
            backgroundColor: "white",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "1rem",
            rotateY: rotateY,
          }}
          onMouseMove={(e) => {
            if (!isAnimating) handleMouseMove(e);
          }}
          onMouseOut={() => {
            if (!isAnimating) handleMouseOut();
          }}
        >
          {/* 앞면 */}
          <div
            style={{
              backfaceVisibility: "hidden",
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "1rem",
            }}
          >
            {/* 앞면 콘텐츠 */}
            <div className="flex w-full h-full">
              <div className="w-3/4 relative">
                <img
                  src={collection.concertImage}
                  alt={collection.concertImage}
                  className="w-full h-full bg-slate-400 rounded-md object-cover"
                />
              </div>
              <div className="w-1/4 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold">
                    {collection.concertName}
                  </h3>
                  {/* <p className="text-gray-600">{collection.concertDate}</p> */}
                  {/* <p className="text-gray-600">{collection.concertTime}</p> */}
                </div>
                <div>
                  <p className="text-gray-500 text-xs whitespace-nowrap">
                    {collectedDate}
                  </p>
                  <p className="text-gray-500 text-xs whitespace-nowrap">
                    {collectedTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 빛 반사 오버레이 */}
          <motion.div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.8), transparent)",
              mixBlendMode: "screen",
              opacity: overlayOpacity,
              pointerEvents: "none",
              borderRadius: "1rem",
            }}
          />
          {/* 뒷면 */}
          <div
            style={{
              backfaceVisibility: "hidden",
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: "rotateY(180deg)",
              overflow: "hidden",
              borderRadius: "1rem",
              backgroundColor: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 뒷면 콘텐츠 */}
            <div className="flex items-center justify-center w-full h-full bg-white rounded-md shadow-md">
              <p className="text-lg font-bold">추가 정보 또는 이미지</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CardItem;
