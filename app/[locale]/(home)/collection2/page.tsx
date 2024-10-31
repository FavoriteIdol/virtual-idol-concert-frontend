"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import Image from "next/image";
import { Card, CardBody } from "@nextui-org/card";
import { motion } from "framer-motion";
import useUserStore from '@store/useUserStore';
import { useRouter } from "next/navigation";
import { LayoutGroup } from "framer-motion";
import { useTranslations } from 'next-intl';
import Tilt from 'react-parallax-tilt';
import apiClient from "@handler/fetch/client";
interface MyPageProps {
  params: {
    id: string;
  };
}

const dummyUser = {
  id: 3,
  email: "john.doe@example.com",
  displayName: "John Doe",
  userName: "johndoe123",
  age: 28,
  gender: "Male",
  authority: "USER",
  location: "Seoul, South Korea",
  token: undefined,
  birthday: "1995-04-15",
  avatarUrl: "https://via.placeholder.com/150",
  tier: "Gold",
};
export default function MyPage({ params }: MyPageProps) {
  const router = useRouter();
  const t = useTranslations();
  const { userInfo, setUserInfo } = useUserStore();
  const [collections, setCollections] = useState<any[]>([]);
  useEffect(() => {
    setUserInfo(dummyUser);
      const fetchCollections = async () => {
        try {
          const response = await apiClient.get(
            `/collections/user/3`,
            {
              params: {
                page: 0,
                size: 10,
              },
            }
          );
          console.log(response.data)
          setCollections(response.data.content); // 페이지네이션의 content 부분만 상태로 설정
        } catch (error) {
          console.error("Failed to fetch collections:", error);
        }
      };

      fetchCollections();
  }, [setUserInfo]);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [imageStyles, setImageStyles] = useState<{ [key: string]: CSSProperties }>({});

  // 각 이미지의 z-index를 관리하기 위한 상태
  const [zIndexState, setZIndexState] = useState<{ [key: string]: number }>({});

  const handleImageClick = (id: string) => {
    const isCurrentlySelected = selectedImageId === id;
    if (isCurrentlySelected) {
      // 이미지가 축소될 때
      setSelectedImageId(null);
      // 애니메이션 완료 후 z-index를 낮춥니다.
      setTimeout(() => {
        setZIndexState((prev) => ({ ...prev, [id]: 1 }));
      }, 500); // 애니메이션 지속 시간에 맞게 조절
    } else {
      // 이미지가 확대될 때
      setZIndexState((prev) => ({ ...prev, [id]: 50 })); // z-index를 즉시 높임
      setSelectedImageId(id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent, imageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const rotateY = ((x / rect.width) - 0.5) * 20;
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


  const tickets = [
    { id: 1, name: t("버추얼 콘서트: 키즈나 아이"), date: "2024-11-01", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 2, name: t("홀로라이브 페스티벌: 호쇼 마린"), date: "2024-12-05", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 3, name: t("니지산지 뮤직 쇼케이스: 츠키노 미토"), date: "2024-10-20", imageUrl: "https://via.placeholder.com/300x150" },
  ];
// variants 정의
const imageVariants = {
  initial: {
    width: "12rem",
    height: "6rem",
    position: "relative" as "relative",
    zIndex: 1,

    brightness: 1,
    transition: {
      type: "tween",
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  selected: {
    width: "24rem",
    height: "12rem",
    position: "relative" as "relative",

    zIndex: 50,
    brightness: 1,
    transition: {
      type: "tween",
      duration: 0.5,
      ease: "easeInOut",
    },
  }
};
  const MotionImage = motion.img;
  return (
    <LayoutGroup>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-grow p-4 space-y-4 pb-16">
          <Card>
            <CardBody className="p-4 overflow-visible">
              <h2 className="font-bold text-lg mb-4">{t("콜렉션")}</h2>
              {collections.map((collection) => {
                const imageId = collection.concertId.toString();
                const isSelected = selectedImageId === imageId;
                return (
                  <div
                    key={collection.concertId}
                    className={`flex mb-4 ${
                      isSelected
                        ? "justify-center items-center"
                        : "items-center"
                    }`}
                  >
                    <motion.div
                      layout
                      layoutId={`image-${collection.concertId}`}
                      onClick={() =>
                        handleImageClick(collection.concertId.toString())
                      }
                      initial="initial"
                      animate={isSelected ? "selected" : "initial"}
                      variants={imageVariants}
                      style={{
                        ...imageStyles[imageId],
                        objectFit: "cover",
                        pointerEvents: "auto",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        height: isSelected ? "6rem" : "6rem",
                        zIndex: zIndexState[imageId] || 1,
                      }}
                      onMouseMove={(e) => handleMouseMove(e, imageId)}
                      onMouseOut={() => handleMouseOut(imageId)}
                      className="rounded-md cursor-pointer overflow-visible"
                    >
                      <motion.img
                        src={collection.concertImage}
                        alt={collection.concertImage}
                        className="w-full h-full rounded-md object-cover"
                      />
                    </motion.div>

                    {!isSelected && (
                      <div className="ml-4">
                        <p className="font-bold text-lg">
                          {collection.concertName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            collection.collectedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </main>
      </div>
    </LayoutGroup>
  );
}
