"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Search from "@/components/CustomSearch";
import Header from "@/components/Header";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Calendar } from "@/components/Calender";
import { useDebounce } from "@uidotdev/usehooks";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import apiClient from "@/handler/fetch/client";
import Link from "next/link";
import Account from "@/components/Account";

const fetchSearchResults = async (pageParam: number, queryKey: string[]) => {
  const response = await apiClient.get(`/search/user/displayName`, {
    params: {
      displayName: queryKey[1],
      page: pageParam,
      size: 5,
    },
  });
  console.log(response.data)
  return response.data;
};

// Concert API fetch function for paginated list
const fetchConcerts = async (pageParam = 0) => {
  const response = await apiClient.get(`/concerts`, {
    params: { page: pageParam, size: 5 },
  });
  return response.data;
};

// Concert API fetch function for the 5 imminent performances
const fetchImminentPerformances = async () => {
  const response = await apiClient.get(`/concerts/imminent`, {
    params: { limit: 5 },
  });
  return response.data;
};

export default function HomeScreen() {
  const router = useRouter();
  const t = useTranslations();
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Fetch imminent performances
  const {
    data: imminentPerformances,
    status: imminentStatus,
    error: imminentError,
  } = useQuery({
    queryKey: ["imminentPerformances"],
    queryFn: fetchImminentPerformances,
    staleTime: 5 * 60 * 1000,
  });

  const {
    fetchNextPage: fetchNextPageConcerts,
    hasNextPage: hasNextPageConcerts,
    isFetchingNextPage: isFetchingNextPageConcerts,
    data: concertData,
    status: statusConcerts,
    error: infiniteErrorConcerts,
  } = useInfiniteQuery({
    queryKey: ["concerts"],
    queryFn: ({ pageParam = 0 }) => fetchConcerts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });

  const {
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    data: search,
    status: statusSearch,
    error: infiniteErrorSearch,
  } = useInfiniteQuery({
    queryKey: ["searchResults", debouncedSearchTerm],
    queryFn: ({ pageParam = 1, queryKey }) =>
      fetchSearchResults(pageParam, queryKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
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
        <div className="bg-white  sticky top-0 z-10 shadow-sm  md:col-span-12 text-xl font-bold">
          <Header title="로고"  hide={!isHeaderVisible}>
            <Search
              onSearchToggle={handleSearchToggle}
              onInput={setSearchQuery}
            />
          </Header>
          {!isHeaderVisible && (
            <div className="p-4 mt-2 w-full flex justify-center items-center">
              <Search
                placeholder="사용자 채널을 검색하세요"
                onSearchToggle={handleSearchToggle}
                initialIsOpen={!isHeaderVisible}
                onInput={setSearchQuery}
              />
            </div>
          )}
        </div>

        {/* 검색 중일 때 검색 결과 표시 */}
        {isSearching ? (
          <div className="p-4">
            {statusSearch === "pending" ? (
              <p>로딩중...</p>
            ) : statusSearch === "error" ? (
              <p>Error: {infiniteErrorSearch.message}</p>
            ) : (
              search?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.content.map((result: any) => (
                    <Link
                      key={result.userId}
                      href={`/collection2/${result.id}`}
                    >
                      <Account
                        className="px-2 py-2"
                        userName={result.id}
                        avatarUrl={result.userImg}
                        displayName={result.userName}
                      />
                    </Link>
                  ))}
                </React.Fragment>
              ))
            )}
            <div ref={loadMoreRef}>
              {isFetchingNextPageSearch
                ? "Loading more..."
                : hasNextPageSearch
                ? "Load More"
                : ""}
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
              {imminentStatus === "pending" ? (
                <p>Loading performances...</p>
              ) : imminentStatus === "error" ? (
                <p>Error: {imminentError.message}</p>
              ) : (
                imminentPerformances?.map((performance: any) => (
                  <SwiperSlide
                    key={performance.id}
                  >
                    <Card className="h-[400px] relative w-full cursor-pointer">
                      <div className="absolute z-20 top-4 left-4 right-4">
                        <div className="absolute inset-0 bg-black/40 rounded-lg -m-3 p-3" />
                        <div className="relative z-10">
                          <p className="text-tiny text-white/80 uppercase font-bold">
                            {new Date(performance.concertDate).toLocaleString(
                              "ko-KR",
                              { dateStyle: "short", timeStyle: "short" }
                            )}
                          </p>
                          <h4 className="text-white font-medium text-2xl">
                            {performance.name}
                          </h4>
                          <p className="text-sm text-white/80 mt-1">
                            {performance.concertName}
                          </p>
                        </div>
                      </div>
                      <div className="relative w-full h-full">
                        <Image
                          alt={`Image for ${performance.name}`}
                          src={performance.concertImg}
                          fill
                          className="object-cover w-full h-full"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    </Card>
                  </SwiperSlide>
                ))
              )}
            </Swiper>

            {/* 더보기 버튼 */}
            {/* <div className="flex justify-end mt-4">
              <Button variant="light" size="sm">
                공연 목록 더보기
              </Button>
            </div> */}

            {/* 캘린더 컴포넌트 추가 */}
            <section className="mt-8">
              <Calendar />
            </section>
          </>
        )}
      </main>
    </>
  );
}
