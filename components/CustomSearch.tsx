"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash"; // lodash로 debounce 적용

interface SearchProps {
  placeholder?:string,
  onSearchToggle: () => void;
  onInput: (input: string) => void; // 검색 쿼리 입력을 처리할 함수
  initialIsOpen?: boolean;
}

const Search = ({ placeholder,onSearchToggle, onInput, initialIsOpen = false }: SearchProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen); // 검색창 상태 관리
  const [inputValue, setInputValue] = useState(""); // 입력 상태 관리

  // 검색창 열고 닫는 함수
  const toggleSearch = () => {
    setIsOpen((prev) => !prev); // 상태 토글
    onSearchToggle(); // 부모 컴포넌트에 상태 변경 알림
  };

  // 입력 값이 변경될 때마다 debounce로 처리된 입력 핸들러 호출
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedOnInput(value);
  };

  // debounce를 사용해 API 호출 최적화
  const debouncedOnInput = debounce((input: string) => {
    onInput(input);
  }, 300); // 300ms debounce 적용

  return (
    <div className="relative w-full flex items-center justify-start">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            onClick={toggleSearch}
            className="h-6 w-6 flex items-center justify-center cursor-pointer"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MagnifyingGlassIcon className="text-black/100 dark:text-white/90 h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute w-full flex items-center"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              isClearable
              radius="lg"
              className="w-full"
              classNames={{
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-white",
                  "dark:bg-white",
                  "backdrop-saturate-200",
                  "hover:bg-white",
                  "group-data-[focus=true]:bg-white",
                  "!cursor-text",
                  "h-8",
                  "w-full",
                  "!w-full",
                ],
              }}
              value={inputValue}
              onChange={handleInputChange} // 입력 값이 변경될 때마다 호출
              placeholder={placeholder}
              startContent={
                <MagnifyingGlassIcon
                  onClick={toggleSearch}
                  className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-auto h-4 w-4 cursor-pointer"
                />
              }
            />
            <button
              onClick={toggleSearch} // 검색창 닫기
              className="ml-2 text-black/50 dark:text-white/90 text-sm cursor-pointer whitespace-nowrap"
            >
              취소
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
