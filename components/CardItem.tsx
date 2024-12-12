import React, { CSSProperties, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Button } from "@nextui-org/button";

// CollectionItem 타입을 CollectionDTO에 맞게 변경
export interface CollectionItem {
  concertId: number;
  concertImage: string;
  concertName: string;
  concertDate: string;
  startTime: string;
  artist: string;
  audience: string;
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
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(isFlipped ? 180 : 0); // 초기 상태 설정

  const overlayOpacity = useTransform(
    [rotateX, rotateY],
    ([latestX, latestY]: any) => {
      const xOpacity = Math.abs(latestX) / 30;
      const yOpacity = Math.abs(latestY) / 30;
      return Math.min(xOpacity + yOpacity, 0.6);
    }
  );

  useEffect(() => {
    setIsAnimating(true);
    if (isSelected) {
      controls
        .start({
          scale: 1.5,
          rotateY: [0, 360],
          rotateX: [0, 15, -15, 10, -10, 0],
          rotateZ: [0, 5, -5, 5, -5, 0],
          transition: { duration: 1, ease: "easeInOut" },
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
      setIsFlipped(false); // 선택 해제 시 뒷면 표시 초기화
    }
  }, [isSelected, controls]);
  const handleCardClick = () => {
    handleImageClick(imageId);
  };
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    controls.start({
      rotateY: isFlipped ? 0 : 180, // 클릭 시 한 바퀴 회전
      transition: { duration: 1.2, ease: "easeInOut" },
    });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRotateY = (x / rect.width - 0.5) * 20;
    const newRotateX = (-(y / rect.height) + 0.5) * 20;
    rotateX.set(newRotateX);
    rotateY.set(newRotateY);
  };

  const handleMouseOut = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const formatDateTime = () => {
    const date = new Date(collection.concertDate);
    const time = collection.startTime;

    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return {
      date: formattedDate,
      time: time
    };
  };

  const { date: concertDate, time: concertTime } = formatDateTime();

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
      {/* 뒷면 보기 버튼 */}
      {isSelected && (
        <Button
          variant="light"
          className="absolute bottom-[-10rem] right-[-10rem] px-4 py-2 rounded bg-blue-400 text-white shadow-md hover:bg-blue-500 z-10"
          onClick={(e) => {
            e.stopPropagation(); // 부모 클릭 이벤트 방지
            handleFlip();
          }}
        >
          {isFlipped ? "앞면 보기" : "뒷면 보기"}
        </Button>
      )}
      <motion.div
        onClick={handleCardClick}
        // onClick={() => handleImageClick(imageId)}
        layout
        layoutId={`card-${imageId}`}
        animate={controls}
        style={{
          width: isSelected
            ? isMobile()
              ? "16rem"
              : "40rem"
            : isMobile()
            ? "24rem"
            : "24rem",
          aspectRatio: "7 / 3", // 비율 유지
          transformStyle: "preserve-3d",
          pointerEvents: isAnimating ? "none" : "auto",
          cursor: "pointer",
        }}
        className="flex overflow-visible"
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            rotateX: rotateX,
            rotateY: rotateY,
            // rotateY: isFlipped ? 180 : 0, // 180도 회전 상태 토글
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
              WebkitMaskImage: "url('/images/ticket.png')",
              maskImage: "url('/images/ticket.png')",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat", 
              maskRepeat: "no-repeat",
            }}
          >
            <div className="font-GangwonEduPowerExtraBoldA font-extrabold flex w-full h-full relative">
              <div className="w-full h-full shadow-lg">
                <img
                  src={collection.concertImage}
                  alt={collection.concertName}
                  className="w-full h-full bg-transparent rounded-md object-cover shadow-lg"
                />
              </div>
              <div
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: isSelected ? "2rem" : "1.1rem",
                  lineHeight: isSelected ? "2.0rem" : "1.0rem",
                  letterSpacing: "-0.07em",
                  textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                }}
                className=" overflow-visible absolute bottom-0 right-5 leading-tight text-stroke overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <p>{collection.concertName.split('"')[0]}</p>
                {collection.concertName.split('"')[1] && <p>"{collection.concertName.split('"')[1]}"</p>}
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
              WebkitMaskImage: "url('/images/ticket-mask.svg')",
              maskImage: "url('/images/ticket-mask.svg')", 
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              WebkitMaskImage: "url('/images/ticket.png')",
              maskImage: "url('/images/ticket.png')",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <div className="font-nanum relative flex items-center justify-center w-full h-full bg-slate-600 rounded-md shadow-md">
              <img
                src={collection.concertImage}
                alt={collection.concertName}
                className="w-full h-full bg-slate-400 rounded-md object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-70 rounded-md"></div>
              <div className="absolute inset-0 grid grid-rows-3 grid-cols-4 p-6 border-0 rounded-md">
                <div className="col-span-4 flex items-center justify-start border border-white p-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white text-sm font-semibold">Title</p>
                  <p className="text-white text-sm font-bold ml-2 font-GangwonEduPowerExtraBoldA">
                    {collection.concertName}
                  </p>
                </div>
                <div className="col-span-2 row-span-2 flex flex-col items-start justify-center border border-white p-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white text-sm font-semibold">Date</p>
                  <p className="text-white text-sm font-bold font-GangwonEduPowerExtraBoldA">
                    {concertDate}
                  </p>
                  <p className="text-white text-sm font-bold font-GangwonEduPowerExtraBoldA">
                    {concertTime}
                  </p>
                </div>
                <div className="col-span-2 row-start-2 flex flex-col items-start justify-center border border-white p-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white text-sm font-semibold">Artist</p>
                  <p className="text-white text-sm font-bold font-GangwonEduPowerExtraBoldA">
                    {collection.artist}
                  </p>
                </div>
                <div className="col-span-2 row-start-3 flex flex-col items-start border border-white justify-center p-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white text-sm font-semibold">Audience</p>
                  <p className="text-white text-sm font-bold font-GangwonEduPowerExtraBoldA">
                    {collection.audience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CardItem;
