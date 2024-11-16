"use client";
import { Home, CreditCard, User } from "lucide-react";
import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import Link from "next/link"; // Import Next.js Link component
import AccountNavItem from "@/components/AccountNavItem";
import { Toaster } from "react-hot-toast";
import TanstackQueryProvider from "@/components/TanstackQueryProvider";
import useUserStore from "@store/useUserStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const userInfo = useUserStore((state) => state.userInfo);

  // userId가 있는 경우에만 콜렉션과 마이페이지 추가
  const menuItems = [
    { icon: Home, label: t("홈"), href: "/" },
    ...(userInfo?.userId
      ? [
          {
            icon: CreditCard,
            label: t("콜렉션"),
            href: `/collection2/${userInfo.userId}`,
          },
          { icon: User, label: t("마이페이지"), href: "/mypage" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 max-w-6xl mx-auto">
      {/* 데스크탑용 Navbar */}
      <aside className="hidden md:block md:col-span-2 lg:col-span-3 p-4 border-r h-screen">
        <nav className="space-y-4">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant="light"
                className="justify-start w-full text-left"
              >
                <item.icon className="w-6 h-6 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className="col-span-1 md:col-span-8 lg:col-span-6">
        <Toaster />
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </main>

      {/* 광고 영역 (데스크탑에서만 표시) */}
      <aside className="hidden md:block md:col-span-2 lg:col-span-3 p-4 border-l h-screen">
        <div className="hidden md:block">
          <AccountNavItem />
        </div>
      </aside>

      {/* 모바일용 Footer */}
      <footer className="fixed bottom-0 z-20 w-full border-t md:hidden">
        <div className="flex justify-around py-2 bg-white">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button variant="light" className="flex flex-col items-center">
                <item.icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
