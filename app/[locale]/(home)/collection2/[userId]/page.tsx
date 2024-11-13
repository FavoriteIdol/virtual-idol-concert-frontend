"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { LayoutGroup } from "framer-motion";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import apiClient from "@handler/fetch/client";
import CardItem from "@/components/CardItem";

interface MyPageProps {
  params: {
    userId: number;
  };
}

interface CollectionItem {
  concertId: number;
  concertImage: string;
  concertName: string;
  collectedDate: string;
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
 const dummyData: PaginatedCollection = {
  totalPages: 1,
  totalElements: 3,
  size: 10,
  content: [
    {
      collectedDate: "2024-11-11T10:24:00.603037",
      concertId: 16,
      concertImage: "http://example.com/concertB.jpg",
      concertName: "Virtual Concert B",
    },
    {
      collectedDate: "2024-11-11T15:16:38.413406",
      concertId: 18,
      concertImage: "http://example.com/concertB.jpg",
      concertName: "Virtual Concert B",
    },
    {
      collectedDate: "2024-11-11T15:43:36.66194",
      concertId: 20,
      concertImage: "http://example.com/concertC.jpg",
      concertName: "Virtual Concert C",
    },
  ],
  number: 0,
  numberOfElements: 3,
  last: true,
  first: true,
  empty: false,
};


export default function MyPage({ params }: MyPageProps) {
  const router = useRouter();
  const t = useTranslations();
  const { userInfo, setUserInfo } = useUserStore();
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
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
  }, [setUserInfo]);

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
      // 이미지가 축소될 때
      setSelectedImageId(null);
    } else {
      // 이미지가 확대될 때
      setSelectedImageId(id);
    }
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
        style={{ overflow: "visible" }} // 부모 컨테이너의 overflow를 visible로 설정
      >
        <main
          className="flex-grow p-4 space-y-4 pb-16"
          style={{ overflow: "visible", position: "relative" }} // 부모 컨테이너의 overflow를 visible로 설정
        >
          <Card style={{ overflow: "visible", position: "relative" }}>
            <CardBody className="p-4" style={{ overflow: "visible", position: "relative" }}>
              <h2 className="font-bold text-lg mb-4">{t("콜렉션")}</h2>
              {collections.map((collection) => {
                const imageId = collection.concertId.toString();
                const isSelected = selectedImageId === imageId;
                return (
                  <CardItem
                    key={collection.concertId}
                    collection={collection}
                    isSelected={isSelected}
                    handleImageClick={handleImageClick}
                    zIndexState={zIndexState}
                  />
                );
              })}
            </CardBody>
          </Card>
        </main>
      </div>
    </LayoutGroup>
  );
}
