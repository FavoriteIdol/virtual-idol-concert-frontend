import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { characterService } from "@/services/characterService";
import { CharacterCreateInput, CharacterUpdateInput } from "@/types/character";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const useCharacters = (userId: number) => {
  console.log('useCharacters hook - userId:', userId);
  
  const t = useTranslations();
  const queryClient = useQueryClient();
  const router = useRouter();

  // 캐릭터 목록 조회
  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters", userId],
    queryFn: () => characterService.getCharactersByUserId(userId),
    enabled: !!userId,
  });

  // 캐릭터 생성
  const createMutation = useMutation({
    mutationFn: (input: CharacterCreateInput) => characterService.createCharacter(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters", userId] });
      toast.success(t("캐릭터가_생성되었습니다"));
      router.push("/my-characters"); // 생성 후 목록 페이지로 이동
    },
    onError: (error) => {
      console.error("Character creation error:", error);
      toast.error(t("캐릭터_생성에_실패했습니다"));
    },
  });

  // 캐릭터 수정
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: CharacterUpdateInput }) =>
      characterService.updateCharacter(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters", userId] });
      toast.success(t("캐릭터가_수정되었습니다"));
    },
    onError: (error) => {
      console.error("Character update error:", error);
      toast.error(t("캐릭터_수정에_실패했습니다"));
    },
  });

  // 캐릭터 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: number) => characterService.deleteCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters", userId] });
      toast.success(t("캐릭터가_삭제되었습니다"));
    },
    onError: (error) => {
      console.error("Character deletion error:", error);
      toast.error(t("캐릭터_삭제에_실패했습니다"));
    },
  });

  return {
    characters,
    isLoading,
    createCharacter: createMutation.mutate,
    updateCharacter: updateMutation.mutate,
    deleteCharacter: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}; 