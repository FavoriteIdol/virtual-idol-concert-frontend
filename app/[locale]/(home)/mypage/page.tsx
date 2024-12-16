"use client";
import { ArrowRight, FileText, HelpCircle, User, LogOut } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import useUserStore from "@store/useUserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiClient from "@handler/fetch/client";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalImage, setModalImage] = useState("");
  const [viewHistory, setViewHistory] = useState<any[]>([]);

  useEffect(() => {

    // 관람 이력 데이터를 API에서 가져오기
    const fetchViewHistory = async () => {
      try {
        const response = await apiClient.get(`/view-history/user/3`, {
          params: { page: 0, size: 10 },
        });
        console.log(response.data)
        setViewHistory(response.data.content); // 페이지네이션의 content 부분만 상태로 설정
      } catch (error) {
        console.error("Failed to fetch view history:", error);
      }
    };

    fetchViewHistory();
  }, [id, setUserInfo]);

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
    onOpen();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-bold">{t("내 페이지")}</h1>
      </header>

      <main className="flex-grow p-4 space-y-4 pb-16">
        {!userInfo ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-lg">{t("로그인이 필요합니다.")}</p>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => router.push("/login")}
            >
              {t("로그인")}
            </Button>
          </div>
        ) : (
          <>
            {/* 사용자 정보 카드 */}
            <Card>
              <CardBody className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{t("닉네임")}</p>
                    <p className="font-bold text-lg">
                      {userInfo?.email || "User"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 관람 이력 카드 */}
            <Card>
              <CardBody className="p-4">
                <h2 className="font-bold text-lg mb-4">{t("관람 이력")}</h2>
                {viewHistory.slice(0, 3).map((historyItem) => (
                  <div
                    key={historyItem.concertId}
                    className="flex items-center mb-4"
                  >
                    <Image
                      src={historyItem.concertImage}
                      alt={historyItem.concertImage}
                      width={800}
                      height={450}
                      className="w-48 h-24 rounded-md mr-4 object-cover cursor-pointer"
                      onClick={() => handleImageClick(historyItem.concertImage)}
                    />
                    <div>
                      <p className="font-bold text-lg">
                        {historyItem.concertName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(historyItem.viewDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {/* 관람 이력 추가가 3개 이상일 때만 더보기 버튼 표시 */}
                {viewHistory.length > 3 && (
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                    onClick={() => router.push("/tickets")}
                  >
                    {t("더보기")}
                  </Button>
                )}
              </CardBody>
            </Card>

            {/* 설정 및 정보 관리 */}
            <Card>
              <CardBody className="p-4 space-y-4">
                {[
                  { 
                    icon: User, 
                    label: t("내_캐릭터"), 
                    onClick: () => router.push("/my-characters") 
                  },
                  { 
                    icon: User, 
                    label: t("내_정보_수정") 
                  },
                  { 
                    icon: FileText, 
                    label: t("공지사항") 
                  },
                  { 
                    icon: HelpCircle, 
                    label: t("문의하기") 
                  },
                  {
                    icon: LogOut,
                    label: t("로그아웃"),
                    onClick: () => {
                      /* 로그아웃 로직 */
                    },
                  },
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="light"
                    className="w-full justify-between py-2 px-0"
                    onClick={item.onClick}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Button>
                ))}
              </CardBody>
            </Card>
          </>
        )}

        {/* 이미지 모달 */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="w-[300px] h-[150px] p-0 m-0">
            {(onClose) => (
              <>
                <ModalBody className="relative p-0 m-0 w-full h-[150px]">
                  <Image
                    src={modalImage}
                    alt="Ticket Image"
                    layout="fill"
                    objectFit="cover"
                  />
                </ModalBody>
                <ModalFooter className="absolute bottom-0 left-0 right-0 p-2 bg-opacity-70 flex justify-end">
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    {t("닫기")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  );
}
