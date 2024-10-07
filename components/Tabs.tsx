"use client";
import React from 'react';
import { Tabs, Tab } from '@nextui-org/tabs';

interface TabsProps {
  tabNames: string[];
  onTabChange: (index: number) => void; // 탭이 변경될 때 호출될 콜백 함수
}

const CustomTabs: React.FC<TabsProps> = ({ tabNames, onTabChange }) => {
  const handleTabChange = (index: number) => {
    onTabChange(index); // 부모 컴포넌트에 탭 변경 전달
  };

  return (
    <>
      <Tabs
        fullWidth={true}
        aria-label="Options"
        color="primary"
        variant="underlined"
        onSelectionChange={(key) => handleTabChange(parseInt(key as string))} // 탭 선택 시 호출
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-2/3 h-1 rounded-full ",
          tab: "h-12",
          tabContent: "group-data-[selected=true]:text-[#171E1F]",
        }}
      >
        {tabNames.map((name, index) => (
          <Tab
            key={index}
            title={
              <div className="flex items-center space-x-2">
                <span>{name}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </>
  );
};

export default CustomTabs;
