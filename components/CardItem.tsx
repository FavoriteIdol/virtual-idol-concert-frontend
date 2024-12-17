import React, { CSSProperties, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Button, ButtonGroup } from "@nextui-org/button";

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

// 상수 정의
const TICKET_WIDTH = 1400;
const TICKET_HEIGHT = TICKET_WIDTH * (3/7); // 7:3 비율 유지

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

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawImageMaintainAspect = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = TICKET_WIDTH / TICKET_HEIGHT;
    let drawWidth = TICKET_WIDTH;
    let drawHeight = drawWidth / imgRatio;  // 너비에 맞춰서 높이 계산
    let offsetX = 0;
    let offsetY = (TICKET_HEIGHT - drawHeight) / 2;  // 세로 중앙 정렬

    // 이미지가 너무 작아서 높이가 부족한 경우
    if (drawHeight < TICKET_HEIGHT) {
      drawHeight = TICKET_HEIGHT;
      drawWidth = drawHeight * imgRatio;
      offsetX = (TICKET_WIDTH - drawWidth) / 2;  // 가로 중앙 정렬
      offsetY = 0;
    }

    // 배경색 채우기 (검은색)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, TICKET_WIDTH, TICKET_HEIGHT);
    
    // 이미지 그리기
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  const captureTicket = async (side: 'front' | 'back') => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = TICKET_WIDTH;
      canvas.height = TICKET_HEIGHT;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // 이미지들 로드
      const [ticketMask, concertImage] = await Promise.all([
        loadImage('/images/ticket.png'),
        loadImage(collection.concertImage)
      ]);

      if (side === 'front') {
        // 앞면 렌더링
        drawImageMaintainAspect(concertImage, ctx);
        
        // 마스크 적용
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(ticketMask, 0, 0, TICKET_WIDTH, TICKET_HEIGHT);

        // 텍스트 추가
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = '48px GangwonEduPowerExtraBoldA';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        // 콘서트 이름 렌더링 (줄바꿈 처리)
        const nameParts = collection.concertName.split('"');
        const bottomPadding = 60;
        const lineHeight = 60;
        
        if (nameParts[1]) {
          ctx.fillText(nameParts[0], TICKET_WIDTH - 60, TICKET_HEIGHT - bottomPadding - lineHeight);
          ctx.fillText(`"${nameParts[1]}"`, TICKET_WIDTH - 60, TICKET_HEIGHT - bottomPadding);
        } else {
          ctx.fillText(collection.concertName, TICKET_WIDTH - 60, TICKET_HEIGHT - bottomPadding);
        }

      } else {
        // 뒷면 렌더링
        drawImageMaintainAspect(concertImage, ctx);
        
        // 마스크 적용
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(ticketMask, 0, 0, TICKET_WIDTH, TICKET_HEIGHT);

        // 반��명 검은색 오버레이
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, TICKET_WIDTH, TICKET_HEIGHT);

        // 그리드 레이아웃 설정
        const padding = TICKET_WIDTH * (isMobile() ? 0.03 : 0.04);
        const contentWidth = TICKET_WIDTH - (padding * 2);
        const contentHeight = TICKET_HEIGHT - (padding * 2);
        
        // Title 영역 높이 먼저 정의
        const titleHeight = contentHeight * 0.3;
        const bottomY = padding + titleHeight;
        const remainingHeight = contentHeight - titleHeight;
        const halfWidth = contentWidth / 2;

        // 그리드 스타일 설정
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';

        // Title 영역 (상단)
        ctx.strokeRect(padding, padding, contentWidth, titleHeight);
        ctx.font = isMobile() ? '24px sans-serif' : '32px sans-serif';
        ctx.textAlign = 'left';
        const titleY = padding + (titleHeight / 2) + 10;
        ctx.fillText('Title', padding + 30, titleY);
        ctx.font = isMobile() ? 'bold 28px GangwonEduPowerExtraBoldA' : 'bold 40px GangwonEduPowerExtraBoldA';
        ctx.fillText(collection.concertName, padding + (isMobile() ? 100 : 130), titleY);

        // Artist & Audience (왼쪽)
        // Artist (왼쪽 상단)
        ctx.strokeRect(padding, bottomY, halfWidth, remainingHeight / 2);
        ctx.font = isMobile() ? '24px sans-serif' : '32px sans-serif';
        ctx.fillText('Artist', padding + 30, bottomY + (isMobile() ? 40 : 50));
        ctx.font = isMobile() ? 'bold 28px GangwonEduPowerExtraBoldA' : 'bold 40px GangwonEduPowerExtraBoldA';
        ctx.fillText(collection.artist, padding + 30, bottomY + (isMobile() ? 80 : 100));

        // Audience (왼쪽 하단)
        const audienceY = bottomY + remainingHeight / 2;
        ctx.strokeRect(padding, audienceY, halfWidth, remainingHeight / 2);
        ctx.font = isMobile() ? '24px sans-serif' : '32px sans-serif';
        ctx.fillText('Audience', padding + 30, audienceY + (isMobile() ? 40 : 50));
        ctx.font = isMobile() ? 'bold 28px GangwonEduPowerExtraBoldA' : 'bold 40px GangwonEduPowerExtraBoldA';
        ctx.fillText(collection.audience, padding + 30, audienceY + (isMobile() ? 80 : 100));

        // Date & Time (오른쪽 전체)
        const rightX = padding + halfWidth;
        ctx.strokeRect(rightX, bottomY, halfWidth, remainingHeight);
        ctx.font = isMobile() ? '24px sans-serif' : '32px sans-serif';
        const dateY = bottomY + (remainingHeight / 2);
        ctx.fillText('Date', rightX + 30, dateY - (isMobile() ? 20 : 30));
        ctx.font = isMobile() ? 'bold 28px GangwonEduPowerExtraBoldA' : 'bold 40px GangwonEduPowerExtraBoldA';
        ctx.fillText(concertDate, rightX + 30, dateY + (isMobile() ? 8 : 10));
        ctx.fillText(concertTime, rightX + 30, dateY + (isMobile() ? 50 : 70));
      }

      // 이미지 다운로드
      const link = document.createElement('a');
      link.download = `${collection.concertName}-ticket-${side}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('티켓 캡처 실패:', error);
    }
  };

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
      {/* 티켓 캡처 버튼과 뒷면 보기 버튼 */}
      {isSelected && (
        <div 
          className={`absolute flex flex-col gap-2 z-10 ${
            isMobile()
              ? "bottom-[-7rem] left-1/2 transform -translate-x-1/2" // 모바일에서 더 아래로 이동 (-4.5rem -> -7rem)
              : "bottom-[-10rem] right-[-10rem]" // PC에서 기존 위치 유지
          }`}
        >
          <ButtonGroup className={isMobile() ? "gap-2" : ""}>
            <Button
              color="primary"
              variant={isMobile() ? "solid" : "flat"}
              size={isMobile() ? "sm" : "md"}
              className={isMobile() ? "bg-white/90 text-black font-semibold" : ""}
              onClick={(e) => {
                e.stopPropagation();
                captureTicket('front');
              }}
            >
              앞면 저장
            </Button>
            <Button
              color="primary"
              variant={isMobile() ? "solid" : "flat"}
              size={isMobile() ? "sm" : "md"}
              className={isMobile() ? "bg-white/90 text-black font-semibold" : ""}
              onClick={(e) => {
                e.stopPropagation();
                captureTicket('back');
              }}
            >
              뒷면 저장
            </Button>
          </ButtonGroup>
          <Button
            variant={isMobile() ? "solid" : "light"}
            size={isMobile() ? "sm" : "md"}
            className={
              isMobile()
                ? "bg-white/90 text-black font-semibold shadow-md"
                : "px-4 py-2 rounded bg-blue-400 text-white shadow-md hover:bg-blue-500"
            }
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
          >
            {isFlipped ? "앞면 보기" : "뒷면 보기"}
          </Button>
        </div>
      )}
      <motion.div
        onClick={handleCardClick}
        layout
        layoutId={`card-${imageId}`}
        animate={controls}
        style={{
          width: "100%",
          maxWidth: isSelected 
            ? (isMobile() 
              ? "calc(100vw - 8rem)"  // 모바일에서 선택됐을 때 크기를 더 작게 조정
              : "40rem") 
            : "24rem",
          aspectRatio: "7 / 3",
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
            id="ticket-front"
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
                  fontSize: isSelected 
                    ? (isMobile() 
                      ? "1.25rem"  // 모바일에서 선택됐을 때 글씨 크기
                      : "2rem")    // PC에서 선택됐을 때 글씨 크기
                    : "1.1rem",    // 선택되지 않았을 때 글씨 크기
                  lineHeight: isSelected 
                    ? (isMobile() 
                      ? "1.5rem"   // 모바일에서 선택됐을 때 줄 간격
                      : "2.0rem")  // PC에서 선택됐을 때 줄 간격
                    : "1.0rem",    // 선택되지 않았을 때 줄 간격
                  letterSpacing: "-0.07em",
                  textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                }}
                className="overflow-visible absolute bottom-0 right-5 leading-tight text-stroke overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <p>{collection.concertName.split('"')[0]}</p>
                {collection.concertName.split('"')[1] && (
                  <p>"{collection.concertName.split('"')[1]}"</p>
                )}
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
            id="ticket-back"
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
              <div className="absolute inset-0 grid grid-rows-3 grid-cols-4 p-3 border-0 rounded-md">
                <div className="col-span-4 flex items-center justify-start border border-white p-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-semibold`}>Title</p>
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-bold ml-1 font-GangwonEduPowerExtraBoldA`}>
                    {collection.concertName}
                  </p>
                </div>
                <div className="col-span-2 row-span-2 flex flex-col items-start justify-center border border-white p-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-semibold`}>Date</p>
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-bold font-GangwonEduPowerExtraBoldA`}>
                    {concertDate}
                  </p>
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-bold font-GangwonEduPowerExtraBoldA`}>
                    {concertTime}
                  </p>
                </div>
                <div className="col-span-2 row-start-2 flex flex-col items-start justify-center border border-white p-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-semibold`}>Artist</p>
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-bold font-GangwonEduPowerExtraBoldA`}>
                    {collection.artist}
                  </p>
                </div>
                <div className="col-span-2 row-start-3 flex flex-col items-start border border-white justify-center p-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-semibold`}>Audience</p>
                  <p className={`text-white ${isMobile() ? "text-[6px]" : "text-xs"} font-bold font-GangwonEduPowerExtraBoldA`}>
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
