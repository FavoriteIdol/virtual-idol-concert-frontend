import { useQuery } from '@tanstack/react-query';
import useUserStore from '@store/useUserStore';
import apiClient from '@handler/fetch/client';

 const useConcertRegistration = () => {
  const userInfo = useUserStore((state) => state.userInfo);

  return useQuery({
    queryKey: ['concertRegistration', userInfo?.userId],
    queryFn: async () => {
      if (!userInfo?.userId) return false;
      const { data } = await apiClient.get(`/concerts/check-registration/${userInfo.userId}`);
      return data;
    },
    enabled: !!userInfo?.userId
  }); 
}

export default useConcertRegistration;