"use client"
import { useEffect, useState } from 'react';
import { Avatar as NextUIAvatar } from '@nextui-org/avatar';

type AvatarProps = {
  src?: string; // 일반 URL만 허용
  alt?: string;
  initials?: string;
  size?: number;
  children?: React.ReactNode;
};

const Avatar = ({
  src,
  alt,
  initials,
  size = 48,
  children,
}: AvatarProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // src가 존재할 때만 imageUrl로 설정
    setImageUrl(src || undefined);
  }, [src]);

  // 이미지가 없으면 이니셜을 표시
  const showInitials = !imageUrl;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <NextUIAvatar
        icon={children}
        classNames={{
          base: "bg-gradient-to-br from-[#5C4747] to-[#000000] z-0",
          icon: "text-black/80",
          name: "text-white",
        }}
        style={{ width: size, height: size }}
        src={imageUrl} // 일반 URL을 img src로 사용
        alt={alt}
        name={showInitials ? initials : undefined} // 이미지가 없을 때만 이니셜 표시
      >
        {children}
      </NextUIAvatar>
    </div>
  );
};

export default Avatar;
