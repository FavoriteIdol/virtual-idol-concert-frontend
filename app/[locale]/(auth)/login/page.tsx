// pages/login.js
"use client";
import useUserStore from "@store/useUserStore";
import Head from "next/head";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NextApiRequest, NextApiResponse } from "next";
import apiClient from "@handler/fetch/client";
export default function LoginPage() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    console.log(value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 로그인 요청
    const response = await apiClient.post("/auth/login", { email, password });

    // 쿠키에서 액세스 토큰을 가져옴
    const accessToken = response.data.token;
    console.log("Login successful:", accessToken);
    console.log("Login successful:", response.data);

    const { id } = response.data;

    
    // // 사용자 정보 요청
 
    // Zustand 스토어에 userInfo를 저장
    const setUserInfo = useUserStore.getState().setUserInfo;
    // const userInfoWithToken = {
    //   ...userInfoResponse.data, // 기존 사용자 정보
    //   token: accessToken, // 토큰 추가
    // };
    setUserInfo(response.data);




    // 홈 페이지로 리다이렉트
    router.push("/");
  };



  return (
    <main className="w-full border-x border-slate-200">
      <section className="flex flex-col items-center w-full h-screen md:flex-row">
        <div className="relative hidden h-full bg-blue-600 lg:block lg:w-1/2 xl:w-2/3">
          <Image
            src="/images/login-bg.gif"
            alt="Background Image"
            className="object-cover w-full h-full"
            layout="fill"
          />
          <div className="absolute top-[-40px] left-[45%] transform -translate-x-1/2 z-10 flex flex-col items-center">
            <Image
              src="/images/logo.png"
              alt="Stage On Logo"
              width={500}
              height={0}
              className="object-contain w-auto"
              style={{ aspectRatio: 'auto' }}
              priority
            />
            <Image
              src="/images/logo-title.png"
              alt="Stage On Title"
              width={380}
              height={0}
              className=" -mt-16 ml-16"
              style={{ 
                width: '450px',  // 직접 width 지정
                height: 'auto',
                aspectRatio: 'auto'
              }}
              priority
            />
          </div>
        </div>

        <div className="flex items-center justify-center w-full h-full px-6 bg-white md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12">
          <div className="w-full max-w-md">
            <Link href={"/"} className="-mb-8">
              <Button
                variant="light"
                size="lg" 
                className="-p-1 -mb-8"
              >
                <Image
                  src="/images/title.png"
                  alt="Stage On"
                  width={150}
                  height={0}
                  className="object-contain w-auto"
                  style={{ aspectRatio: 'auto' }}
                  priority
                />
              </Button>
            </Link>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div>
                {/* <label className="block text-gray-700">Email Address</label> */}
                <Input
                  isRequired
                  type="email"
                  label="Email"
                  autoFocus
                  errorMessage="Please enter a valid email"
                  autoComplete="on"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <Input
                  isRequired
                  label="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="mt-2 text-red-500">{error}</p>}
              <div className="mt-2 text-right">
                <Link
                  href="#"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="block w-full px-4 py-3 mt-6 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400"
              >
                Log In
              </Button>
            </form>

            <hr className="w-full my-6 border-gray-300" />

            <p className="mt-8">
              Need an account?
              <Link
                href="/signin"
                className="font-semibold text-blue-500 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-12 text-sm text-gray-500">
              &copy; 2024 최애의 I - All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}