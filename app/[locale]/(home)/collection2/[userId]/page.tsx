"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { LayoutGroup } from "framer-motion";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import apiClient from "@handler/fetch/client";
import CardItem, { CollectionItem } from "@/components/CardItem";

interface MyPageProps {
  params: {
    userId: number;
  };
}


// dummyData.ts
export interface PaginatedCollection {
  totalPages: number;
  totalElements: number;
  size: number;
  content: CollectionItem[];
  number: number;
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}


export default function MyPage({ params }: MyPageProps) {
  const router = useRouter();
  const t = useTranslations();
  const { userInfo, setUserInfo } = useUserStore();
  const [collections, setCollections] = useState<CollectionItem[]>([]);
 const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => {
    const fetchCollections = async () => {
      if (!params.userId) return; // userId가 없으면 함수 종료

      try {
        const response = await apiClient.get(
          `/collections/user/${params.userId}`,
          {
            params: {
              page: 0,
              size: 10,
            },
          }
        );
        console.log(response.data);
        setCollections(response.data.content); // 페이지네이션의 content 부분만 상태로 설정
        // setCollections(dummyData.content);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, [params.userId, setCollections]); // userId가 변경될 때만 useEffect 재실행

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [imageStyles, setImageStyles] = useState<{
    [key: string]: CSSProperties;
  }>({});

  // 각 이미지의 z-index를 관리하기 위한 상태
  const [zIndexState, setZIndexState] = useState<{
    [key: string]: number;
  }>({});


  const handleImageClick = (id: string) => {
    const isCurrentlySelected = selectedImageId === id;
    if (isCurrentlySelected) {
      // 카드가 클릭되면 반바퀴 회전
      setIsFlipped((prev) => !prev);
    } else {
      // 카드가 선택될 때
      setSelectedImageId(id);
      setIsFlipped(false); // 선택 시 초기화
    }
  };
  const handleOverlayClick = () => {
    setSelectedImageId(null);
    setIsFlipped(false);
  };

  const handleMouseMove = (e: React.MouseEvent, imageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // 요소 내에서의 X 좌표
    const y = e.clientY - rect.top; // 요소 내에서의 Y 좌표
    const rotateY = (x / rect.width - 0.5) * 20;
    const rotateX = (-(y / rect.height) + 0.5) * 20;
    const brightness = 0.65 + (x / rect.width) * 0.5;

    setImageStyles((prevStyles) => ({
      ...prevStyles,
      [imageId]: {
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        filter: `brightness(${brightness})`,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.1s, filter 0.1s",
      },
    }));
  };

  const handleMouseOut = (imageId: string) => {
    setImageStyles((prevStyles) => ({
      ...prevStyles,
      [imageId]: {
        transform: "perspective(600px) rotateY(0deg) rotateX(0deg)",
        filter: "brightness(1)",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.5s, filter 0.5s",
      },
    }));
  };

   return (
     <LayoutGroup>
       <div
         className="flex flex-col min-h-screen bg-gray-100"
         style={{ overflow: "visible", position: "relative" }}
       >
         {/* 전체 화면 오버레이 */}
         {selectedImageId && (
           <div
             className="fixed inset-0 bg-black bg-opacity-50 z-30"
             onClick={() => setSelectedImageId(null)} // 오버레이 클릭 시 선택 해제
             style={{
               cursor: "pointer",
             }}
           ></div>
         )}

         <main
           className="flex-grow p-4 space-y-4 pb-16"
           style={{
             overflow: "visible",
             position: "relative",
           }}
         >
           <Card style={{ overflow: "visible", position: "relative" }}>
             <CardBody
               className="p-4"
               style={{ overflow: "visible", position: "relative" }}
             >
               <h2 className="font-bold text-lg mb-4">{t("콜렉션")}</h2>
               <div
                 className="flex flex-wrap gap-4 justify-center"
                 style={{
                   overflow: "visible", // CardItem을 포함하는 부모 div의 overflow를 visible로 설정
                   aspectRatio: "4 / 3", // 카드 리스트 컨테이너 비율 유지
                 }}
               >
                 {collections.map((collection) => {
                   const imageId = collection.concertId.toString();
                   const isSelected = selectedImageId === imageId;
                  console.log(collection);
                   return (
                     <div
                       key={collection.concertId}
                       style={{
                         zIndex: isSelected ? 50 : 15, // 선택된 카드만 오버레이 위에 표시
                         position: isSelected ? "relative" : "initial",
                         overflow: "visible", // CardItem을 포함하는 부모 div의 overflow를 visible로 설정
                         aspectRatio: "4 / 2",
                       }}
                     >
                       <CardItem
                         collection={collection}
                         isSelected={isSelected}
                         handleImageClick={handleImageClick}
                         zIndexState={{}}
                       />
                     </div>
                   );
                 })}
               </div>
             </CardBody>
           </Card>
         </main>
       </div>
     </LayoutGroup>
   );
}
