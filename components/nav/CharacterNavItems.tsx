import { Button } from "@nextui-org/button";
import { Mic2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useConcertRegistration from "@/hooks/useConcertRegistration";

const CharacterNavItems = () => {
  const t = useTranslations();
  const { data: hasConcert, isLoading: isConcertLoading } = useConcertRegistration();

  // 로딩 중이거나 공연이 없는 경우 표시하지 않음
  if (isConcertLoading || !hasConcert) return null;

  return (
    <Link href="/my-characters">
      <Button variant="light" className="justify-start w-full text-left">
        <Mic2 className="w-6 h-6 mr-2" />
        {t("내_캐릭터")}
      </Button>
    </Link>
  );
};

export default CharacterNavItems; 