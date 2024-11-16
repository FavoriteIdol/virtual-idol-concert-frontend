// pages/signin.js
"use client";
import Head from "next/head";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@handler/fetch/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    router.push(
      "https://master-of-prediction.shop:8081/oauth2/authorization/google"
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.target as HTMLFormElement);

    const data = {
      userName: formData.get("userName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      userImg: "", // Will set this after uploading the image
    };

    try {
      // If a profile image is selected, upload it
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append("file", profileImage);

        const uploadResponse = await apiClient.post(
          "/files/upload",
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Assuming the API returns the URL of the uploaded image in response.data.url
        data.userImg = uploadResponse.data;
      }

      // Now submit the registration data
      const response = await apiClient.post("/auth/register", data);

      console.log(response.data);
      // Redirect to login page upon successful registration
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full border-x border-slate-200">
      <section className="flex flex-col items-center w-full h-screen md:flex-row">
        <div className="relative hidden h-full bg-blue-600 lg:block lg:w-1/2 xl:w-2/3">
          <Image
            src="/images/login-bg.gif"
            alt="Background Image"
            className="object-cover w-full h-full"
            layout="fill" // or specify width and height
          />
        </div>

        <div className="flex items-center justify-center w-full h-full px-6 bg-white md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12">
          <div className="w-full max-w-md">
            <Link href={"/"}>
              <Button variant="light" size="lg" className="p-2 font-bold">
                차원저편에서 만난 최애와의 잊을 수 없는 무대입니다만
              </Button>
            </Link>
            <form className="mt-6" onSubmit={handleSubmit}>
              {/* Profile Image Upload Field */}
              <div className="flex flex-col items-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <label htmlFor="profileImage" className="mt-4">
                  <Button as="span" variant="light">
                    프로필 이미지 선택
                  </Button>
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Full Name Field */}
              <div className="mt-6">
                <Input
                  name="userName"
                  isRequired
                  type="text"
                  label="Full Name"
                  autoFocus
                  variant="bordered"
                  required
                />
              </div>

              {/* Email Address Field */}
              <div className="mt-4">
                <Input
                  name="email"
                  isRequired
                  type="email"
                  label="Email"
                  autoComplete="on"
                  required
                  variant="bordered"
                />
              </div>

              {/* Password Field */}
              <div className="mt-4">
                <Input
                  name="password"
                  isRequired
                  label="Password"
                  type="password"
                  variant="bordered"
                  required
                />
              </div>

              {/* Display Error Message */}
              {errorMessage && (
                <p className="mt-4 text-red-500">{errorMessage}</p>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full px-4 py-3 mt-6 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400"
                isDisabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>

            <p className="mt-8">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-500 hover:text-blue-700"
              >
                로그인
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
