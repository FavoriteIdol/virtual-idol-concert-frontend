"use client";
import React, { useEffect, useState } from 'react';
import StickyTabsWrapper from '@/components/StickyTabs';
import Search from '@/components/CustomSearch';
import CategoryChannelCard from '@/components/CategoryChannelCard';
import Header from '@/components/Header';
import Account from '@/components/Account';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash'; // lodash를 사용하여 debounce 적용
import apiClient from '@/handler/fetch/client'
import Link from 'next/link';
import { useDebounce } from "@uidotdev/usehooks";
import { useInView } from 'react-intersection-observer';


// Fetch search results
const fetchSearchResults = async (pageParam:number ,queryKey: string[]) => {
  const response = await apiClient.get(`/search/user/displayName`,{
    params: { 
      q: queryKey[1],
      page: pageParam,
      size: 5,
      }} );
  return response.data;
};
export default function Page() {
  const tabs = ["공연", "유저"];
  const [activeTab, setActiveTab] = useState(0); // 탭 상태 관리
  const [isHeaderVisible, setHeaderVisible] = useState(true); // 헤더 보임 여부 관리
  const [isSearching, setIsSearching] = useState(false); // 검색 상태 관리
  const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리 상태
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5, // 50%가 보일 때 트리거
    triggerOnce: false, // 여러 번 트리거되도록 설정
  });

  // 검색 상태와 헤더 상태 토글 함수
  const handleSearchToggle = () => {
    setHeaderVisible((prev) => !prev); // 헤더 표시 상태 반전
    setIsSearching((prev) => !prev);   // 검색 중인지 여부 설정
  };

  // 검색 입력 핸들러 (debounce 적용)
  const handleSearchInput = debounce((input: string) => {
    setSearchQuery(input);
  }, 300);
  const {
    fetchNextPage: fetchNextPageSearch,
    fetchPreviousPage: fetchPreviousPageSearch,
    hasNextPage : hasNextPageSearch,
    hasPreviousPage:hasPreviousPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    isFetchingPreviousPage:isFetchingPreviousPageSearch,
    data: search,
    error:infiniteErrorSearch,
    status:statusSearch

  } = useInfiniteQuery(
    {
      queryKey: ['searchResults',debouncedSearchTerm],
      queryFn: ({ pageParam = 1 ,queryKey })=> fetchSearchResults(pageParam,queryKey),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
      // lastPage는 Spring Page 객체입니다.
      console.log(lastPage);
      if (!lastPage.last) {
        return lastPage.number + 1; // 다음 페이지 번호를 반환
      } else {
        return undefined; // 더 이상 페이지가 없으면 undefined 반환
      }
      },
      enabled: !!debouncedSearchTerm,
      staleTime: 5 * 60 * 1000,
    }
  );

  // 탭 변경 핸들러
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  useEffect(() => {
    console.log("hasNextPage",hasNextPageSearch)
    console.log("isInView",isInView)
    if (isInView && hasNextPageSearch) {
      fetchNextPageSearch();
    }
  }, [isInView, hasNextPageSearch, fetchNextPageSearch]);

  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* 검색 상태에 따라 헤더와 검색창 고정 */}
        <div>
          <Header title="검색" hide={!isHeaderVisible}>
            <Search  onSearchToggle={handleSearchToggle} onInput={handleSearchInput} />
          </Header>
          {!isHeaderVisible && (
            <div className="p-4 mt-2 w-full flex justify-center items-center">
              <Search placeholder="사용자 채널을 검색하세요" onSearchToggle={handleSearchToggle} initialIsOpen={!isHeaderVisible} onInput={handleSearchInput} />
            </div>
          )}
        </div>

        {/* 검색 중이 아닐 때 탭 표시 */}
        {!isSearching && (
          <>
            <StickyTabsWrapper tabNames={tabs} onTabChange={handleTabChange} />

            {/* 탭에 따른 조건부 렌더링 */}
            <div className="p-4">
              {activeTab === 0 && (
                <div>
                  {/* <CategoryChannelCard
                    href="/community/react-developers"
                    categoryChannelName="React Developers"
                    badge="Technology"
                    avatars={[
                      "https://i.pravatar.cc/150?u=react-dev",
                      "https://i.pravatar.cc/150?u=react-dev1",
                      "https://i.pravatar.cc/150?u=react-dev2",
                      "https://i.pravatar.cc/150?u=react-dev3",
                    ]}
                  />
                  <CategoryChannelCard
                    href="/community/javascript-masters"
                    categoryChannelName="JavaScript Masters"
                    badge="Programming"
                    avatars={[
                      "https://i.pravatar.cc/150?u=js-master",
                      "https://i.pravatar.cc/150?u=js-master1",
                      "https://i.pravatar.cc/150?u=js-master2",
                      "https://i.pravatar.cc/150?u=js-master3",
                    ]}
                  /> */}
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  {/* <CategoryChannelCard
                    href="/community/ux-ui-designers"
                    categoryChannelName="UX/UI Designers"
                    badge="Design"
                    avatars={[
                      "https://i.pravatar.cc/150?u=ux-ui",
                      "https://i.pravatar.cc/150?u=ux-ui1",
                      "https://i.pravatar.cc/150?u=ux-ui2",
                      "https://i.pravatar.cc/150?u=ux-ui3",
                    ]}
                  />
                  <CategoryChannelCard
                    href="/community/fullstack-developers"
                    categoryChannelName="Fullstack Developers"
                    badge="Fullstack"
                    avatars={[
                      "https://i.pravatar.cc/150?u=fullstack-dev",
                      "https://i.pravatar.cc/150?u=fullstack-dev1",
                      "https://i.pravatar.cc/150?u=fullstack-dev2",
                      "https://i.pravatar.cc/150?u=fullstack-dev3",
                    ]}
                  /> */}
                </div>
              )}
            </div>
          </>
        )}

        {/* 검색 중일 때 검색 결과 표시 */}
        {isSearching && (
          <div className="p-4">
        
            
{statusSearch === 'pending' ? (
                    <p>Loading users...</p>
                  ) : statusSearch === 'error' ?  <p>Error: {infiniteErrorSearch.message}</p>: 
                 (


                  search?.pages.map((page, pageIndex) =>(
                    <React.Fragment key={pageIndex}>
                      {page.content.map( ((result: any) => (
                 <Link key={result.userId} href={`/channel/${result.user_id}`}>
                 <Account
                   className="px-2 py-2"
                   userName={result.user_name}
                   avatarUrl={result.avatar_img} 
                   displayName={result.display_name}
                   tier={result.tier}
                 />
               </Link>
                 ))
                      )
                      }
                    </React.Fragment>
                  ))
                   
                  )}
                   <div ref={loadMoreRef}>
                
                {isFetchingNextPageSearch ? 'Loading more...' : hasNextPageSearch
                     ? 'Load More'
                     : ''}
              </div>
          </div>
        )}
      </main>
    </>
  );
}
