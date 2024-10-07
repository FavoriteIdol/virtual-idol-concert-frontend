"use client";
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// UserInfo 인터페이스 정의
export interface UserInfo {
  id?: number;
  email?: string;
  displayName?: string;
  userName?: string;
  age?: number;
  gender?: string;
  authority?: string;
  location?: string;
  token?: string;
  birthday?: string;
  avatarUrl?: string ;
  tier?: string;
}

// UserStore 인터페이스 정의
interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo ) => void;
  clearUserInfo: () => void;
  hasHydrated: boolean; // Hydration 완료 여부 상태
  setHasHydrated: (state: boolean) => void; // Hydration 상태 업데이트 함수
}

// Zustand 스토어 생성
const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        userInfo: null,
        hasHydrated: false, // 초기값 false
        setUserInfo: (info) => {
          set({ userInfo: info });
        },
        clearUserInfo: () => {
          console.log("clearUserInfo called");
          set({ userInfo: null });
          localStorage.removeItem('user-storage');
        },
        setHasHydrated: (state: boolean) => {
          set({ hasHydrated: state });
        },
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ userInfo: state.userInfo }),
        onRehydrateStorage: () => (state) => {
          console.log("rehydrate success");
          state?.setHasHydrated(true); // Hydration이 완료되면 상태를 true로 설정
        },
      }
    ),
    { name: 'UserStore' }
  )
);

export default useUserStore;