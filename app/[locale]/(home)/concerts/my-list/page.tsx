'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@handler/fetch/client';
import { Card, Button, Tabs, Tab } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import useUserStore from '@store/useUserStore';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';

interface SongDTO {
  id: number;
  title: string;
  artist: string;
}

interface Concert {
  id: number;
  name: string;
  img: string | null;
  concertDate: string;
  startTime: string;
  endTime: string;
  appearedVFX: number;
  feverVFX: number;
  userId: number;
  userName: string;
  stageId: number;
  ticketPrice: string;
  peopleScale: string;
  songs: SongDTO[];
}

export default function MyConcertsPage() {
  const t = useTranslations();
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);

  const { data: concerts, isLoading } = useQuery({
    queryKey: ['myConcerts', userInfo?.userId],
    queryFn: async () => {
      if (!userInfo?.userId) return [];
      const { data } = await apiClient.get(`/concerts/user/${userInfo.userId}`);
      return data.content;
    },
    enabled: !!userInfo?.userId
  });

  const categorizedConcerts = useMemo(() => {
    if (!concerts) return { upcoming: [], ongoing: [], past: [] };

    const now = new Date();
    return concerts.reduce((acc: { upcoming: Concert[], ongoing: Concert[], past: Concert[] }, concert: Concert) => {
      const concertDate = new Date(concert.concertDate);
      const startTime = new Date(`${concert.concertDate}T${concert.startTime}`);
      const endTime = new Date(`${concert.concertDate}T${concert.endTime}`);

      if (endTime < now) {
        acc.past.push(concert);
      } else if (startTime <= now && endTime >= now) {
        acc.ongoing.push(concert);
      } else {
        acc.upcoming.push(concert);
      }
      return acc;
    }, { upcoming: [], ongoing: [], past: [] });
  }, [concerts]);

  const ConcertCard = ({ concert, isPast }: { concert: Concert, isPast: boolean }) => (
    <Card key={concert.id} className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{concert.name}</h2>
          <p className="text-sm text-gray-500">
            {concert.concertDate} {concert.startTime} - {concert.endTime}
          </p>
          {concert.songs && concert.songs.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {t("공연곡")}: {concert.songs.map(song => song.title).join(", ")}
            </p>
          )}
        </div>
        {!isPast && (
          <Button 
            color="primary"
            onClick={() => router.push(`/concerts/edit/${concert.id}`)}
          >
            {t("공연_수정")}
          </Button>
        )}
      </div>
      {concert.img && (
        <div className="relative mt-2 w-full h-48">
          <Image
            alt={concert.name}
            src={concert.img}
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
    </Card>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t("공연_목록")}</h1>
      <Tabs aria-label="Concert categories">
        <Tab key="upcoming" title={t("예정된_공연")}>
          <div className="grid gap-4 mt-4">
            {categorizedConcerts.upcoming.map((concert: Concert) => (
              <ConcertCard key={concert.id} concert={concert} isPast={false} />
            ))}
            {categorizedConcerts.upcoming.length === 0 && (
              <p className="text-center text-gray-500">{t("예정된_공연_없음")}</p>
            )}
          </div>
        </Tab>
        <Tab key="ongoing" title={t("진행_중인_공연")}>
          <div className="grid gap-4 mt-4">
            {categorizedConcerts.ongoing.map((concert: Concert) => (
              <ConcertCard key={concert.id} concert={concert} isPast={false} />
            ))}
            {categorizedConcerts.ongoing.length === 0 && (
              <p className="text-center text-gray-500">{t("진행_중인_공연_없음")}</p>
            )}
          </div>
        </Tab>
        <Tab key="past" title={t("지난_공연")}>
          <div className="grid gap-4 mt-4">
            {categorizedConcerts.past.map((concert: Concert) => (
              <ConcertCard key={concert.id} concert={concert} isPast={true} />
            ))}
            {categorizedConcerts.past.length === 0 && (
              <p className="text-center text-gray-500">{t("지난_공연_없음")}</p>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
} 