import { create } from 'zustand';
import { devtools } from 'zustand/middleware'; // devtools 임포트

interface TranslationState {
  messages: Record<string, string>;
  lang: string; // 현재 언어 상태 추가
  setMessages: (messages: Record<string, string>) => void;
  setLang: (lang: string) => void; // 언어 설정 함수 추가
}

export const useTranslationStore = create<TranslationState>()(
  devtools((set) => ({
    messages: {},
    lang: 'en', // 기본 언어를 'en'으로 설정
    setMessages: (messages) => set({ messages }),
    setLang: (lang) => set({ lang }), // 언어를 설정하는 함수
  }), { name: "TranslationStore" }) // devtools에서 보여질 스토어 이름
);
