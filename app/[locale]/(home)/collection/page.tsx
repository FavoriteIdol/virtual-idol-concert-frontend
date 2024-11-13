"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import Image from "next/image";
import { Card, CardBody } from "@nextui-org/card";
import useUserStore from '@store/useUserStore';
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

interface MyPageProps {
  params: {
    id: string;
  };
}


export default function MyPage({ params }: MyPageProps) {
  const { id } = params;
  const router = useRouter();
  const t = useTranslations();
  const { userInfo, setUserInfo } = useUserStore();



  const isOwner = true;
  const [modalImage, setModalImage] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageStyles, setImageStyles] = useState<{ [key: string]: CSSProperties }>({});
  const [shinePosition, setShinePosition] = useState({ backgroundPosition: '50% 50%' });

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent, imageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 20;
    const rotateX = -(y / rect.height - 0.5) * 20;
    const brightness = 1.1 + (x / rect.width) * 0.5;

    setShinePosition({ backgroundPosition: `${x}px ${y}px` });

    setImageStyles({
      ...imageStyles,
      [imageId]: {
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        filter: `brightness(${brightness})`,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
      },
    });
  };

  const handleMouseOut = (imageId: string) => {
    setImageStyles({
      ...imageStyles,
      [imageId]: {
        transform: 'perspective(600px) rotateY(0deg) rotateX(0deg)',
        filter: 'brightness(1)',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      },
    });
    setShinePosition({ backgroundPosition: '50% 50%' });
  };

  const tickets = [
    { id: 1, name: t("버추얼 콘서트: 키즈나 아이"), date: "2024-11-01", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 2, name: t("홀로라이브 페스티벌: 호쇼 마린"), date: "2024-12-05", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 3, name: t("니지산지 뮤직 쇼케이스: 츠키노 미토"), date: "2024-10-20", imageUrl: "https://via.placeholder.com/300x150" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4 space-y-4 pb-16">
        <Card>
          <CardBody className="p-4">
            <h2 className="font-bold text-lg mb-4">{t('콜렉션')}</h2>
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center mb-4">
                <div
                  className="relative w-48 h-24 rounded-md object-cover cursor-pointer overflow-hidden"
                  onMouseMove={(e) => handleMouseMove(e, ticket.id.toString())}
                  onMouseOut={() => handleMouseOut(ticket.id.toString())}
                  style={{
                    ...imageStyles[ticket.id],
                    transition: 'transform 0.2s, filter 0.2s, box-shadow 0.2s',
                    background: `radial-gradient(circle at ${shinePosition.backgroundPosition}, rgba(255, 255, 255, 0.8), transparent 60%)`,
                    pointerEvents: 'auto',
                  }}
                >
                  <Image
                    src={ticket.imageUrl}
                    alt={ticket.name}
                    width={800}
                    height={450}
                    className="w-48 h-24 rounded-md object-cover cursor-pointer"
                    onClick={() => handleImageClick(ticket.imageUrl)}
                  />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-lg">{ticket.name}</p>
                  <p className="text-sm text-gray-500">{ticket.date}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {isImageModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="relative p-4 bg-white rounded shadow-md">
              <button onClick={closeImageModal} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
                &times;
              </button>
              <Image src={modalImage} alt="Expanded Ticket Image" width={800} height={450} className="rounded-md" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
