import { useQuery } from "@tanstack/react-query";
import useUserStore from "@store/useUserStore";
import apiClient from "@handler/fetch/client";
import useConcertRegistration from "./useConcertRegistration";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const useCharacterRegistration = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const { data: hasConcert } = useConcertRegistration();

  return useQuery({
    queryKey: ["characterRegistration", userInfo?.userId],
    queryFn: async () => {
      if (!userInfo?.userId || !hasConcert) return false;
      const { data } = await apiClient.get(`/characters/check/${userInfo.userId}`);
      return data;
    },
    enabled: !!userInfo?.userId && !!hasConcert
  });
};

export default useCharacterRegistration; 