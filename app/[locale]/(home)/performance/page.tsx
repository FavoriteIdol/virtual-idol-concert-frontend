"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import moment from 'moment';
import { Button } from "@nextui-org/button";

// Dummy data for performances
const performances = [
  { id: 1, title: '버튜버 라이브 "호시노 소라"', date: '2024-10-10T19:00:00', location: '버추얼 홀 A', image: 'https://nextui.org/images/card-example-4.jpeg', description: 'A special live performance by Hoshino Sora!' },
  { id: 2, title: '버튜버 콘서트 "미즈키 스트림 페스트"', date: '2024-10-10T20:30:00', location: '버추얼 스테이지 B', image: 'https://nextui.org/images/card-example-3.jpeg', description: 'Mizuki Stream Fest featuring amazing performances!' },
  { id: 3, title: '버튜버 댄스쇼 "시온의 댄스 파티"', date: '2024-10-12T18:00:00', location: '버추얼 홀 C', image: 'https://nextui.org/images/card-example-2.jpeg', description: 'A dance party you don’t want to miss by Shion!' },
  { id: 4, title: '버튜버 연극 "아카리의 판타지"', date: '2024-10-12T20:00:00', location: '버추얼 극장 D', image: 'https://nextui.org/images/card-example-5.jpeg', description: 'A fantasy play by Akari full of magic and wonder!' },
  { id: 5, title: '버튜버 콘서트 "유메의 드림 쇼"', date: '2024-10-14T19:30:00', location: '버추얼 홀 E', image: 'https://nextui.org/images/card-example-6.jpeg', description: 'Yume’s Dream Show concert featuring unforgettable performances!' },
];

export default function PerformanceDetail() {
  const router = useRouter();

  // Find the performance based on the ID from the query parameters
  const performance = performances.find((perf) => perf.id === Number(1));

  if (!performance) {
    return <p>Loading...</p>; // Handle the case when the performance is not found
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-md overflow-hidden">
        <Image
          alt={`Image for ${performance.title}`}
          src={performance.image}
          width={800}
          height={400}
          className="object-cover w-full h-64"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{performance.title}</h1>
          <p className="text-gray-500 mb-4">{moment(performance.date).format('MMMM Do YYYY, h:mm A')}</p>
          <p className="text-gray-700 mb-4">Location: {performance.location}</p>
          <p className="text-gray-800 mb-6">{performance.description}</p>
          <Button variant="light" onClick={() => router.back()}>
            Back to List
          </Button>
        </div>
      </div>
    </div>
  );
}
