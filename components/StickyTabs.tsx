"use client";
import React from 'react';
import CustomTabs from '@/components/Tabs';

interface TabsProps {
  tabNames: string[];
  onTabChange: (index: number) => void; // 탭 변경 핸들러 전달
}

const StickyTabsWrapper: React.FC<TabsProps> = ({ tabNames, onTabChange }) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Sticky Tabs */}
      <div
        style={{
          position: 'sticky',
          top: `0px`,
          zIndex: 10,
          backgroundColor: 'white',
        }}
      >
        {/* 탭 변경 핸들러 전달 */}
        <CustomTabs tabNames={tabNames} onTabChange={onTabChange} />
      </div>
    </div>
  );
};

export default StickyTabsWrapper;
