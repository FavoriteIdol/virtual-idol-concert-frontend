"use client";
import { Bell } from 'lucide-react';
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useTranslations } from 'next-intl';
import Image from "next/image";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import moment from 'moment';
import { Calendar } from '@/components/Calender'; // Import the Calendar component

export default function HomeScreen() {
  const t = useTranslations(); // 국제화 훅 사용

  // VTuber 공연 더미 데이터
// Updated VTuber 공연 더미 데이터
const imminentPerformances = [
  { id: 1, title: '버튜버 라이브 "호시노 소라"', date: '2024-10-10T19:00:00', location: '버추얼 홀 A', image: 'https://nextui.org/images/card-example-4.jpeg' },
  { id: 2, title: '버튜버 콘서트 "미즈키 스트림 페스트"', date: '2024-10-10T20:30:00', location: '버추얼 스테이지 B', image: 'https://nextui.org/images/card-example-3.jpeg' },
  { id: 3, title: '버튜버 댄스쇼 "시온의 댄스 파티"', date: '2024-10-12T18:00:00', location: '버추얼 홀 C', image: 'https://nextui.org/images/card-example-2.jpeg' },
  { id: 4, title: '버튜버 연극 "아카리의 판타지"', date: '2024-10-12T20:00:00', location: '버추얼 극장 D', image: 'https://nextui.org/images/card-example-5.jpeg' },
  { id: 5, title: '버튜버 콘서트 "유메의 드림 쇼"', date: '2024-10-14T19:30:00', location: '버추얼 홀 E', image: 'https://nextui.org/images/card-example-6.jpeg' },
];


  return (
    <>
      {/* 헤더 */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex justify-between md:col-span-12">
        <h1 className="text-xl font-bold">로고</h1>
      </header>

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-gray-100">
        {/* 메인 콘텐츠 */}
        <main className="col-span-1 md:col-span-12 w-full border-x border-slate-200 p-4 space-y-4">
          {/* 첫 번째 카드 */}
          <Swiper
            className="w-full"
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
          >
            {imminentPerformances.map((performance) => (
              <SwiperSlide key={performance.id}>
                <Card className="h-[400px] relative w-full">
                  <div className="absolute z-10 top-4 left-4 flex-col items-start">
                    <p className="text-tiny text-white/80 uppercase font-bold">
                      {new Date(performance.date).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    <h4 className="text-white font-medium text-2xl">
                      {performance.title}
                    </h4>
                    <p className="text-sm text-white/80 mt-1">{performance.location}</p>
                  </div>
                  <Image
                    alt={`Image for ${performance.title}`}
                    src={performance.image}
                    fill
                    className="z-0 object-cover w-full h-full"
                  />
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 더보기 버튼 */}
          <div className="flex justify-end mt-4">
            <Button variant='light' size='sm'>
              공연 목록 더보기
            </Button>
          </div>

          {/* 캘린더 컴포넌트 추가 */}
          <section className="mt-8">
            <Calendar />
          </section>
        </main>
      </div>
    </>
  );
}
