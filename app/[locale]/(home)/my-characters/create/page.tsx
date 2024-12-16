"use client";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { useTranslations } from "next-intl";
import useUserStore from "@store/useUserStore";
import { useCharacters } from "@/hooks/useCharacters";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateCharacterPage() {
  const t = useTranslations();
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  const { createCharacter, isCreating } = useCharacters(userInfo?.userId || 0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    model: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error(t("이미지를_선택해주세요"));
      return;
    }
    if (!formData.model) {
      toast.error(t("모델_파일을_선택해주세요"));
      return;
    }

    createCharacter({
      name: formData.name,
      description: formData.description,
      image: formData.image,
      model: formData.model,
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("새_캐릭터_만들기")}</h1>
      
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
            required
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
            required
          />
        </div>

        <div className="flex gap-2 justify-end">
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
            isLoading={isCreating}
          >
            {t("생성")}
          </Button>
        </div>
      </form>
    </div>
  );
} 