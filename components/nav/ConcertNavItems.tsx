import { Button } from "@nextui-org/button";
import { Music } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useConcertRegistration from "@/hooks/useConcertRegistration";

const ConcertNavItems = () => {
  const t = useTranslations();
  const { data: isRegistered, isLoading } = useConcertRegistration();

  if (isLoading || !isRegistered) return null;

  return (
    <Link href="/concerts/my-list">
      <Button variant="light" className="justify-start w-full text-left">
        <Music className="w-6 h-6 mr-2" />
        {t("내_공연")}
      </Button>
    </Link>
  );
};

export default ConcertNavItems; 