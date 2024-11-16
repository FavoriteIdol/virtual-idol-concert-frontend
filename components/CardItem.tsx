import React, { CSSProperties, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

// CollectionItem 타입을 CollectionDTO에 맞게 변경
interface CollectionItem {
  concertId: number;
  concertImage: string;
  concertName: string;
  collectedDate: string;
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

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

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
          transition: { duration: 4, ease: "easeInOut" },
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
        onClick={() => handleImageClick(imageId)}
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
          height: isSelected
            ? isMobile()
              ? "7rem"
              : "13rem"
            : isMobile()
            ? "10rem"
            : "10rem",
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
            }}
          >
            <div className="font-GangwonEduPowerExtraBoldA flex w-full h-full relative">
              <div className="w-full h-full shadow-lg">
                <img
                  src={collection.concertImage}
                  alt={collection.concertName}
                  className="w-full h-full bg-transparent rounded-md object-cover shadow-lg"
                />
              </div>
              <div className="absolute bottom-0 right-5 leading-tight text-stroke overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="leading-tight font-bold text-medium">
                  {collection.concertName.split('"')[0]}
                </p>
                <p className="leading-tight text-medium">
                  "{collection.concertName.split('"')[1]}"
                </p>
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
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="font-nanum relative flex items-center justify-center w-full h-full bg-slate-600 rounded-md shadow-md">
              <img
                src={collection.concertImage}
                alt={collection.concertName}
                className="w-full h-full bg-slate-400 rounded-md object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-70 rounded-md"></div>
              <div className="absolute inset-0 grid grid-rows-3 grid-cols-4 p-4 border-2 border-white rounded-md">
                <div className="col-span-4 flex items-center justify-start border border-white p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white font-semibold">Title</p>
                  <p className="text-white font-bold ml-2">
                    {collection.concertName}
                  </p>
                </div>
                <div className="col-span-2 row-span-2 flex flex-col items-start justify-center border border-white p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white font-semibold">Date</p>
                  <p className="text-white font-bold">{collectedDate}</p>
                  <p className="text-white font-bold">{collectedTime}</p>
                </div>
                <div className="col-span-2 row-start-2 flex flex-col items-start justify-center border border-white p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white font-semibold">Artist</p>
                  <p className="text-white font-bold">{collection.artist}</p>
                </div>
                <div className="col-span-2 row-start-3 flex flex-col items-start border border-white justify-center p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-white font-semibold">Audience</p>
                  <p className="text-white font-bold">{collection.audience}</p>
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
