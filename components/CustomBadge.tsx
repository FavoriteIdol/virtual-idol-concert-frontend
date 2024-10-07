"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Avatar, AvatarGroup, Card, CardBody, Image, Spacer } from "@nextui-org/react";

// 랜덤 색상 생성 함수
// function getRandomColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

export default function CustomBadge({ children }: { children: ReactNode }) {
  const [bgColor, setBgColor] = useState("#494949"); // 초기 색상

//   useEffect(() => {
//     setBgColor(getRandomColor()); // 컴포넌트가 마운트될 때마다 랜덤 배경색 설정
//   }, []);

  return (
<span
  className="
    inline-block 
    text-white 
    text-[10px] 
    font-medium 
    px-2 
    py-1 
    rounded-full
    whitespace-nowrap 
    max-w-fit 
    flex-shrink-0 
    bg-slate-500
    my-1
  "

>
  {children}
</span>
  );
}
