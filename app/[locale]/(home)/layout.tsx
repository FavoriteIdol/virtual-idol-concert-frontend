"use client";
import { Home, CreditCard, User } from "lucide-react";
import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import AccountNavItem from "@/components/AccountNavItem";
import { Toaster } from "react-hot-toast";
import TanstackQueryProvider from "@/components/TanstackQueryProvider";
import useUserStore from "@store/useUserStore";
import ConcertNavItems from "@/components/nav/ConcertNavItems";
import CharacterNavItems from "@/components/nav/CharacterNavItems";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const userInfo = useUserStore((state) => state.userInfo);

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
    <TanstackQueryProvider>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 max-w-6xl mx-auto">
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
            {userInfo?.userId && (
              <>
                <ConcertNavItems />
              </>
            )}
          </nav>
        </aside>
        <main className="col-span-1 md:col-span-8 lg:col-span-6">
          <Toaster />
          {children}
        </main>

        <aside className="hidden md:block md:col-span-2 lg:col-span-3 p-4 border-l h-screen">
          <div className="hidden md:block">
            <AccountNavItem />
          </div>
        </aside>

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
    </TanstackQueryProvider>
  );
}
