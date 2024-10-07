"use client";
import React from "react";
import { Avatar, AvatarGroup } from "@nextui-org/avatar";
import { Card, CardBody} from "@nextui-org/card";
import {  Image } from "@nextui-org/image";
import { Spacer } from "@nextui-org/spacer";
import CustomBadge from "@/components/CustomBadge";
import Link from "next/link"; // Next.js의 Link 컴포넌트 import

interface CategoryChannelCardProps {
  href: string; // 이동할 경로
  categoryChannelName: string; // 커뮤니티 이름
  badge: string; // 배지 텍스트 (카테고리)
  avatars: string[]; // 아바타 이미지 리스트
}

export default function CategoryChannelCard({ href, categoryChannelName, badge, avatars }: CategoryChannelCardProps) {
  return (
    <Link href={href}> {/* 외부에서 받은 경로로 이동 */}
      <Card
        isBlurred
        className="border-none bg-transparent w-auto shadow-none cursor-pointer" // 카드를 클릭 가능하게 설정
        shadow="sm"
      >
        <CardBody>
          <div className="flex items-center gap-4">
            {/* Left: Community Image */}
            <div className="shrink-0">
              <Image
                alt={`${categoryChannelName} cover`}
                className="object-cover"
                height={80} // 높이를 더 작게 설정
                shadow="md"
                src={avatars[0]} // 첫 번째 아바타 이미지를 커버로 사용
                width={80} // 너비도 고정
              />
            </div>

            {/* Right: Community Details */}
            <div className="flex flex-col justify-center">
              {/* Community Name */}
              <h5 className="font-semibold text-foreground/90 text-medium">{categoryChannelName}</h5>

              {/* Category Badge */}
              <CustomBadge>{badge}</CustomBadge>

              {/* Spacer */}
              <Spacer y={0.5} />

              {/* Avatar Group */}
              <AvatarGroup
                isBordered
                max={3}
                total={avatars.length - 3} // 추가 아바타 수
                renderCount={(count) => (
                  <p className="text-xs text-foreground font-medium ms-2">+{count} others</p>
                )}
              >
                {avatars.slice(1, 4).map((avatar, index) => ( // 두 번째 아바타부터 최대 3개 표시
                  <Avatar key={index} src={avatar} size="sm" />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
