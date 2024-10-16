"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Search from '@/components/CustomSearch';
import Header from '@/components/Header';
import { Bell } from 'lucide-react';
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import moment from 'moment';
import { Calendar } from '@/components/Calender';
import { useDebounce } from "@uidotdev/usehooks";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import apiClient from '@/handler/fetch/client';
import Link from 'next/link';
import Account from '@/components/Account';

const fetchSearchResults = async (pageParam: number, queryKey: string[]) => {
  const response = await apiClient.get(`/search/user/displayName`, {
    params: {
      q: queryKey[1],
      page: pageParam,
      size: 5,
    }
  });
  return response.data;
};

export default function HomeScreen() {
  const router = useRouter();
  const t = useTranslations();
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { ref: loadMoreRef, inView: isInView } = useInView({ threshold: 0.5, triggerOnce: false });

  const imminentPerformances = [
    { id: 1, title: '버튜버 라이브 "호시노 소라"', date: '2024-10-10T19:00:00', location: '버추얼 홀 A', image: 'https://nextui.org/images/card-example-4.jpeg' },
    { id: 2, title: '버튜버 콘서트 "미즈키 스트림 페스트"', date: '2024-10-10T20:30:00', location: '버추얼 스테이지 B', image: 'https://nextui.org/images/card-example-3.jpeg' },
    { id: 3, title: '버튜버 댄스쇼 "시온의 댄스 파티"', date: '2024-10-12T18:00:00', location: '버추얼 홀 C', image: 'https://nextui.org/images/card-example-2.jpeg' },
    { id: 4, title: '버튜버 연극 "아카리의 판타지"', date: '2024-10-12T20:00:00', location: '버추얼 극장 D', image: 'https://nextui.org/images/card-example-5.jpeg' },
    { id: 5, title: '버튜버 콘서트 "유메의 드림 쇼"', date: '2024-10-14T19:30:00', location: '버추얼 홀 E', image: 'https://nextui.org/images/card-example-6.jpeg' },
  ];

  const {
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    data: search,
    status: statusSearch,
    error: infiniteErrorSearch,
  } = useInfiniteQuery({
    queryKey: ['searchResults', debouncedSearchTerm],
    queryFn: ({ pageParam = 1, queryKey }) => fetchSearchResults(pageParam, queryKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (!lastPage.last ? lastPage.number + 1 : undefined),
    enabled: !!debouncedSearchTerm,
    staleTime: 5 * 60 * 1000,
  });

  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  useEffect(() => {
    if (isInView && hasNextPageSearch) {
      fetchNextPageSearch();
    }
  }, [isInView, hasNextPageSearch, fetchNextPageSearch]);

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 검색 상태에 따라 헤더와 검색창 고정 */}
        <div className="bg-white p-4 sticky top-0 z-10 shadow-sm  md:col-span-12 text-xl font-bold">
       
          <Header   title="로고" hide={!isHeaderVisible}>
            <Search onSearchToggle={handleSearchToggle} onInput={setSearchQuery} />
          </Header>
          {!isHeaderVisible && (
            <div className="p-4 mt-2 w-full flex justify-center items-center">
              <Search placeholder="사용자 채널을 검색하세요" onSearchToggle={handleSearchToggle} initialIsOpen={!isHeaderVisible} onInput={setSearchQuery} />
            </div>
          )}
        </div>

        {/* 검색 중일 때 검색 결과 표시 */}
        {isSearching ? (
          <div className="p-4">
            {statusSearch === 'pending' ? (
              <p>Loading users...</p>
            ) : statusSearch === 'error' ? (
              <p>Error: {infiniteErrorSearch.message}</p>
            ) : (
              search?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.content.map((result: any) => (
                    <Link key={result.userId} href={`/channel/${result.user_id}`}>
                      <Account
                        className="px-2 py-2"
                        userName={result.user_name}
                        avatarUrl={result.avatar_img}
                        displayName={result.display_name}
                        tier={result.tier}
                      />
                    </Link>
                  ))}
                </React.Fragment>
              ))
            )}
            <div ref={loadMoreRef}>
              {isFetchingNextPageSearch ? 'Loading more...' : hasNextPageSearch ? 'Load More' : ''}
            </div>
          </div>
        ) : (
          <>
            {/* 공연 리스트 */}
            <Swiper
              className="w-full"
              spaceBetween={16}
              slidesPerView={1}
              loop={true}
              pagination={{ clickable: true }}
              modules={[Pagination]}
            >
              {imminentPerformances.map((performance) => (
                <SwiperSlide key={performance.id} onClick={() => router.push(`/performance/${performance.id}`)}>
                  <Card className="h-[400px] relative w-full cursor-pointer">
                    <div className="absolute z-10 top-4 left-4 flex-col items-start">
                      <p className="text-tiny text-white/80 uppercase font-bold">
                        {new Date(performance.date).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <h4 className="text-white font-medium text-2xl">{performance.title}</h4>
                      <p className="text-sm text-white/80 mt-1">{performance.location}</p>
                    </div>
                    <Image alt={`Image for ${performance.title}`} src={performance.image} fill className="z-0 object-cover w-full h-full" />
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 더보기 버튼 */}
            <div className="flex justify-end mt-4">
              <Button variant='light' size='sm'>공연 목록 더보기</Button>
            </div>

            {/* 캘린더 컴포넌트 추가 */}
            <section className="mt-8">
              <Calendar performances={imminentPerformances} />
            </section>
          </>
        )}
      </main>
    </>
  );
}
