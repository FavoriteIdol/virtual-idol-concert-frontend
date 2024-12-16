"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { useTranslations } from "next-intl";
import useUserStore from "@store/useUserStore";
import { useCharacters } from "@/hooks/useCharacters";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { characterService } from "@/services/characterService";

export default function EditCharacterPage({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  const { updateCharacter, deleteCharacter, isUpdating, isDeleting } = useCharacters(userInfo?.userId || 0);

  const { data: character, isLoading } = useQuery({
    queryKey: ["character", params.id],
    queryFn: () => characterService.getCharactersByUserId(userInfo?.userId || 0)
      .then(characters => characters.find(c => c.id === parseInt(params.id))),
    enabled: !!userInfo?.userId,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    model: null as File | null,
  });

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        description: character.description,
        image: null,
        model: null,
      });
    }
  }, [character]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateCharacter({
      id: parseInt(params.id),
      input: {
        name: formData.name,
        description: formData.description,
        image: formData.image || undefined,
        model: formData.model || undefined,
      },
    });
  };

  const handleDelete = async () => {
    if (window.confirm(t("캐릭터를_삭제하시겠습니까"))) {
      deleteCharacter(parseInt(params.id), {
        onSuccess: () => {
          router.push("/my-characters");
        }
      });
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!character) return <div>캐릭터를 찾을 수 없습니다</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("캐릭터_수정")}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("캐릭터_이름")}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Textarea
          label={t("설명")}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t("캐릭터_이미지")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, image: file });
              }
            }}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t("캐릭터_모델_파일")}
          </label>
          <input
            type="file"
            accept=".fbx,.glb,.gltf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, model: file });
              }
            }}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 justify-between">
          <Button
            type="button"
            color="danger"
            variant="flat"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            {t("삭제")}
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="flat"
              onClick={() => router.back()}
            >
              {t("취소")}
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isUpdating}
            >
              {t("수정_완료")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 