"use client";
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';  // Heroicons에서 아이콘 가져오기
import DropdownNext from '@/components/DropdownAccountNavItem';
import useUserStore from '@store/useUserStore';
import { Button } from '@nextui-org/button';
import {useRouter} from 'next/navigation';
 
const AccountNavItem = () => {
  // useUserStore에서 사용자 정보를 가져옴 (null일 수 있음)
  const router = useRouter();
  const { userInfo } = useUserStore();
  const handleClick = () => {
    router.push("/login");
  };

  // userInfo가 null인지 확인하여 속성에 접근
  if (!userInfo) {
    return (
      <div className="flex flex-1 items-center gap-x-2 px-4 py-8">
        <div className="flex items-center gap-x-3 flex-1">
        <Button
                  radius="full"
                  variant="solid"
                  color="primary"
                  className="font-bold w-full p-3 mb-4"
                  onClick={handleClick}
                >
                  로그인
                </Button>
        </div>
      </div>
    );
  }
  // userInfo가 null이 아닌 경우 데이터 사용
  const { userName,displayName,userId ,userImg} = userInfo;
  // 권한이나 티어에 따라 사용자 티어 설정 (기본 값은 '회원')

  return (
    <div className="flex flex-1 items-center gap-x-2 px-4 py-8">
      <div className="flex items-center gap-x-3 flex-1">
        <div className="flex flex-1 xl:flex-none justify-center xl:justify-start">
          <Avatar
            src={userImg} // 사용자 이미지가 없으면 기본 이미지 사용
            alt={userName || "사용자"}
            initials={userName ? userName[0] : "U"} // 이름의 첫 글자 표시
          />
        </div>

        <div className="hidden sm:flex flex-col">
          <p className="text-base font-semibold">{displayName || userName}</p>
          <p className="text-sm text-slate-600 font-medium">
            @{userId || "username"}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex">
        <DropdownNext />
      </div>
    </div>
  );
};

export default AccountNavItem;
