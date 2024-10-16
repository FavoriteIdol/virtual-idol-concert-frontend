"use client";
import { ArrowRight, FileText, HelpCircle, User, LogOut } from "lucide-react";
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from "react";
import useUserStore from '@store/useUserStore'; // Zustand로 상태 관리한다고 가정
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MyPageProps {
  params: {
    id: string; // 동적 라우팅으로 받은 id
  };
}
// const dummyUser = {
//   id: 1,
//   email: "john.doe@example.com",
//   displayName: "John Doe",
//   userName: "johndoe123",
//   age: 28,
//   gender: "Male",
//   authority: "USER",
//   location: "Seoul, South Korea",
//   token: "abc123456token",
//   birthday: "1995-04-15",
//   avatarUrl: "https://via.placeholder.com/150", // 아바타 더미 이미지 URL
//   tier: "Gold",
// };

export default function MyPage({ params }: MyPageProps) {
  const { id } = params;  // 동적 라우팅에서 가져온 id
  const router = useRouter();
  const t = useTranslations();
  const {userInfo ,setUserInfo } = useUserStore(); // 로그인한 사용자 정보 가져오기


  // 자신의 페이지인지 확인
  // const isOwner = userInfo?.userId === id; // userInfo의 userId와 URL의 id 비교
  const isOwner = true; // userInfo의 userId와 URL의 id 비교

  // 로그인 상태가 없고 자신의 페이지일 경우 로그인 페이지로 리디렉션

  // 모달 상태 관리
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalImage, setModalImage] = useState("");

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
    onOpen(); // 모달 열기
  };

  // 티켓 데이터 (예시)
  const tickets = [
    { id: 1, name: t("버추얼 콘서트: 키즈나 아이"), date: "2024-11-01", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 2, name: t("홀로라이브 페스티벌: 호쇼 마린"), date: "2024-12-05", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 3, name: t("니지산지 뮤직 쇼케이스: 츠키노 미토"), date: "2024-10-20", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 4, name: t("버추얼 페스티벌: 사쿠라 미코"), date: "2025-01-12", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 5, name: t("이세계 아이돌 콘서트: 소라"), date: "2024-11-15", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 6, name: t("버추얼 DJ 나이트: 카가미 하야토"), date: "2024-12-25", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 7, name: t("VTuber Awards: 마츠리 페스티벌"), date: "2024-09-30", imageUrl: "https://via.placeholder.com/300x150" },
    { id: 8, name: t("VTuber Awards: 마츠리 페스티벌"), date: "2024-09-30", imageUrl: "https://via.placeholder.com/300x150" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-bold">{isOwner ? t('내 페이지') : t('마이페이지')}</h1> {/* 소유 여부에 따라 변경 */}
      </header>

      <main className="flex-grow p-4 space-y-4 pb-16">
        {isOwner && !userInfo ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-lg">{t("로그인이 필요합니다.")}</p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => router.push("/login")}>
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
                      <p className="text-sm text-gray-500">{t('닉네임')}</p>
                      <p className="font-bold text-lg">{userInfo?.email || "User"}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
         
            {/* 보유 티켓 카드 그룹화 */}
            <Card>
              <CardBody className="p-4">
                <h2 className="font-bold text-lg mb-4">{t('관람 이력')}</h2>
                {tickets.slice(0, isOwner ? 3 : tickets.length).map((ticket) => (
                  <div key={ticket.id} className="flex items-center mb-4">
                    <Image
                      src={ticket.imageUrl}
                      alt={ticket.name}
                      width={800}
                      height={450}
                      className="w-48 h-24 rounded-md mr-4 object-cover cursor-pointer"
                      onClick={() => handleImageClick(ticket.imageUrl)}  // 이미지 클릭 이벤트
                    />
                    <div>
                      <p className="font-bold text-lg">{ticket.name}</p>
                      <p className="text-sm text-gray-500">{ticket.date}</p>
                    </div>
                  </div>
                ))}
                {/* 티켓이 3개 초과일 때만 더보기 버튼 표시 (자신의 페이지일 경우에만 표시) */}
                {isOwner && tickets.length > 3 && (
                  <Button className="bg-green-500 hover:bg-green-600 text-white w-full" onClick={() => router.push("/tickets")}>
                    {t("더보기")}
                  </Button>
                )}
              </CardBody>
            </Card>

            {/* 설정 및 정보 관리 (자신의 페이지에서만 표시) */}
            {isOwner && (
              <Card>
                <CardBody className="p-4 space-y-4">
                  {[ 
                    { icon: User, label: t('내 정보 수정') }, // 소유 여부에 따라 변경
                    { icon: FileText, label: t('공지사항') },
                    { icon: HelpCircle, label: t('문의하기') },
                    { icon: LogOut, label: t("로그아웃"), onClick: () => {/* 로그아웃 로직 */} },
                  ].map((item, index) => (
                    <Button key={index} variant="light" className="w-full justify-between py-2 px-0">
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Button>
                  ))}
                </CardBody>
              </Card>
            )}
          </>
        )}

        {/* 이미지 모달 - NextUI 사용 */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="w-[300px] h-[150px] p-0 m-0"> 
            {(onClose) => (
              <>
                <ModalBody className="relative p-0 m-0 w-full h-[150px]"> {/* 이미지가 모달을 꽉 채우도록 */}
                  <Image
                    src={modalImage}
                    alt="Ticket Image"
                    layout="fill"         
                    objectFit="cover"     
                  />
                </ModalBody>
                <ModalFooter className="absolute bottom-0 left-0 right-0 p-2 bg-opacity-70 flex justify-end">
                  <Button size="sm" color="danger" variant="light" onPress={onClose}>
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
