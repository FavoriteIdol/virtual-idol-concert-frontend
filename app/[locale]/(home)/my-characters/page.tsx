"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useTranslations } from "next-intl";
import useUserStore from "@store/useUserStore";
import Link from "next/link";
import { useCharacters } from "@/hooks/useCharacters";

export default function MyCharactersPage() {
  const t = useTranslations();
  const userInfo = useUserStore((state) => state.userInfo);
  
  console.log('UserInfo:', userInfo);
  
  const { 
    characters, 
    isLoading, 
    updateCharacter,
    isUpdating 
  } = useCharacters(userInfo?.userId || 0);

  console.log('Characters data:', characters);
  console.log('Current userId:', userInfo?.userId);

  if (isLoading) return <div>로딩 중...</div>;

  const handleToggleActive = (id: number, currentActive: boolean) => {
    console.log('Toggle active:', { id, currentActive });
    updateCharacter({ 
      id, 
      input: { active: !currentActive } 
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("내 캐릭터")}</h1>
        <Link href="/my-characters/create">
          <Button color="primary">
            {t("새 캐릭터 만들기")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters?.map((character) => (
          <Card key={character.id} className="w-full">
            <CardBody>
              <div className="aspect-video relative">
                <Image
                  alt={character.name}
                  className="object-cover"
                  src={character.imageUrl}
                  width="100%"
                  height="100%"
                />
              </div>
              <h3 className="text-xl font-bold mt-2">{character.name}</h3>
              <p className="text-gray-600">{character.description}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  character.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {character.active ? t("활성화") : t("비활성화")}
                </span>
              </div>
            </CardBody>
            <CardFooter className="gap-2">
              <Button 
                as={Link} 
                href={`/my-characters/${character.id}/edit`}
                variant="flat"
              >
                {t("수정")}
              </Button>
              <Button 
                color={character.active ? "default" : "primary"}
                variant="flat"
                isLoading={isUpdating}
                onClick={() => handleToggleActive(character.id, character.active)}
              >
                {character.active ? t("비활성화") : t("활성화")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 