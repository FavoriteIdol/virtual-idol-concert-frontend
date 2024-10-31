"use client";
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useUserStore from '@store/useUserStore'; // Zustand 스토어 가져오기

export default function DropdownNext() {
  const clearUserInfo = useUserStore((state) => state.clearUserInfo); // Zustand에서 clearUserInfo 함수 가져오기

  const handleLogout = () => {
    clearUserInfo();
    console.log('User logged out successfully.');
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">
          <EllipsisHorizontalIcon className="w-6 h-6" />  {/* Heroicons 아이콘 사용 */}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownItem key="logout" className="text-danger" onClick={handleLogout}>
          로그아웃
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
