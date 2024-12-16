import apiClient from "@handler/fetch/client";
import { Character, CharacterCreateInput, CharacterUpdateInput } from "@/types/character";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const characterService = {
  // 캐릭터 목록 조회
  getCharactersByUserId: async (userId: number): Promise<Character[]> => {
    const { data } = await apiClient.get(`/characters/user/${userId}`);
    console.log('API Response:', data);
    return data;
  },

  // 캐릭터 생성
  createCharacter: async (input: CharacterCreateInput): Promise<number> => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("image", input.image);
    formData.append("model", input.model);

    const { data } = await apiClient.post(`/characters`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // 캐릭터 수정
  updateCharacter: async (id: number, input: CharacterUpdateInput): Promise<void> => {
    const formData = new FormData();
    if (input.name) formData.append("name", input.name);
    if (input.description) formData.append("description", input.description);
    if (input.image) formData.append("image", input.image);
    if (input.model) formData.append("model", input.model);
    if (input.active !== undefined) formData.append("isActive", String(input.active));

    console.log('Update request:', { id, input });
    await apiClient.put(`/characters/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 캐릭터 삭제
  deleteCharacter: async (id: number): Promise<void> => {
    await apiClient.delete(`/characters/${id}`);
  },

  // 캐릭터 보유 여부 확인
  hasCharacter: async (userId: number): Promise<boolean> => {
    const { data } = await apiClient.get(`/characters/check/${userId}`);
    return data;
  },
}; 