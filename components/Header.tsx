"use client";
import React from "react";

const Header = ({ title, children, hide }: { title: string; children?: React.ReactNode; hide?: boolean }) => (
  <>
    {!hide && (
      <div className="sticky bg-white/75 z-10 backdrop-blur-md top-0">
        <div className="flex items-center justify-between px-4 py-2">
          {/* 제목 텍스트 */}
          <h2 className="text-xl font-bold">{title}</h2>
          {/* 오른쪽에 들어갈 검색 컴포넌트 */}
          <div className="flex-shrink-0">{children}</div>
        </div>
      </div>
    )}
  </>
);

export default Header;
