import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/card";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/button";
import apiClient from "@/handler/fetch/client";

// 공연 데이터 타입
interface Performance {
  id: number;
  name: string; // 공연 이름
  img: string; // 공연 이미지 URL
  concertDate: string; // 공연 날짜
  startTime: string; // 공연 시작 시간
  ticketPrice: number; // 티켓 가격
  stageName: string; // 무대 이름
  stageImg?: string; // 무대 이미지 URL
}

export const Calendar = () => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 현재 년과 월을 상태로 관리
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  ); // 0부터 시작

  // 오늘 날짜로 selectedDate 초기화
  useEffect(() => {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setSelectedDate(formattedToday);
  }, []);

  // 월별 공연 데이터를 API로 가져오기
  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await apiClient.get(`/concerts/by-month`, {
          params: {
            year: currentYear,
            month: currentMonth + 1, // 월은 1부터 시작하도록 API에 전달
          },
        });
  console.log(response.data);

        setPerformances(response.data);
      } catch (error) {
        console.error("Failed to fetch performances:", error);
      }
    };
    fetchPerformances();
  }, [currentYear, currentMonth]);

  // 월 변경 함수
  const handlePrevMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 이번 달의 첫째 날과 마지막 날
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // 이번 달의 공연들만 필터링
  const thisMonthPerformances = performances.filter((performance) => {
    const performanceDate = new Date(performance.concertDate);
    return (
      performanceDate.getFullYear() === currentYear &&
      performanceDate.getMonth() === currentMonth
    );
  });

  // 공연 날짜 목록 (중복 제거)
  const performanceDates = Array.from(
    new Set(
      thisMonthPerformances.map((performance) =>
        new Date(performance.concertDate).getDate()
      )
    )
  );

  // 해당 날짜에 공연이 있는지 확인
  const isPerformanceDay = (day: number): boolean => {
    return performanceDates.includes(day);
  };

  // 날짜 클릭 시 해당 날짜로 설정
  const handleDateClick = (day: number) => {
    setSelectedDate(
      `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`
    );
  };

  // 선택된 날짜의 공연들
  const selectedDatePerformances = thisMonthPerformances.filter(
    (performance) => {
      return performance.concertDate.startsWith(selectedDate || "");
    }
  );

  // 요일 이름들
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 달력에 표시할 빈 칸 수 (첫 주의 이전 월 날짜들)
  const emptyCells = firstDayOfMonth.getDay();

  // 이번 달 총 일 수
  const daysInMonth = lastDayOfMonth.getDate();

  // 선택된 날짜의 일(day)만 추출하는 함수
  const getSelectedDay = () => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      return `${date.getDate()}일 공연`;
    }
    return "";
  };

  // 월과 연도를 포맷팅하는 함수
  const getFormattedMonthYear = () => {
    return `${currentYear}년 ${currentMonth + 1}월`;
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-16">
      {/* 월 변경 버튼과 현재 월 표시 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onPress={handlePrevMonth}
          isIconOnly
          variant="light"
          aria-label="이전 달"
          className="text-xl font-bold"
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
        <h2 className="text-xl font-bold">{getFormattedMonthYear()}</h2>
        <Button
          onPress={handleNextMonth}
          isIconOnly
          variant="light"
          aria-label="다음 달"
          className="text-xl font-bold"
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center mb-4">
        {weekdays.map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {/* 빈 칸 채우기 */}
        {Array.from({ length: emptyCells }).map((_, index) => (
          <div key={`empty-${index}`} className="p-1"></div>
        ))}
        {/* 날짜 표시 */}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const hasPerformance = isPerformanceDay(day);
          const isSelected =
            selectedDate ===
            `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;

          return (
            <motion.div key={day} className="p-1" whileTap={{ scale: 0.9 }}>
              <div
                onClick={() => handleDateClick(day)}
                className={`cursor-pointer w-10 h-10 mx-auto flex items-center justify-center rounded-full
                  ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : hasPerformance
                      ? "border-2 border-blue-500 text-blue-600 font-bold"
                      : "text-gray-800"
                  }
                `}
              >
                <span className="text-sm">{day}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 선택된 날짜의 공연들 표시 */}
      <AnimatePresence>
        {selectedDatePerformances.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-lg font-semibold mb-4">{getSelectedDay()}</h3>
            <div className="space-y-2">
              {selectedDatePerformances.map((performance) => (
                <Card key={performance.id} className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-sm">{performance.name}</h4>
                      <p className="text-gray-600 text-sm">
                        Stage: {performance.stageName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {performance.startTime}
                      </p>
                      <p className="text-gray-500 text-sm">
                        티켓 가격: {performance.ticketPrice}원
                      </p>
                    </div>
                    <div className="w-16 h-16 relative ml-2 flex-shrink-0">
                      {performance.stageImg &&
                        <Image
                          src={performance.stageImg}
                          alt={performance.stageName}
                          fill
                          className="object-cover rounded"
                        />
                      }
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
