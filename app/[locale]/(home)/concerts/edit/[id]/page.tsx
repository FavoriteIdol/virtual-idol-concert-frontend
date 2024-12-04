'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@handler/fetch/client';
import { Input, Button, Textarea, Select, SelectItem, Card } from "@nextui-org/react";
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, X as XIcon, Upload, ImageIcon, X } from "lucide-react";
import useUserStore from '@store/useUserStore';
import { toast } from 'react-hot-toast';

interface SongDTO {
  id: number;
  title: string;
  artistId: number;
  url: string;
}

interface ConcertUpdateForm {
  name: string;
  concertDate: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  peopleScale: string;
  songIds: number[];
  img?: string;
  newImage?: File;
}

interface SongUploadForm {
  title: string;
  file: File | null;
}

export default function EditConcertPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const concertId = params.id;
  const userInfo = useUserStore((state) => state.userInfo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [songUploadForm, setSongUploadForm] = useState<SongUploadForm>({
    title: '',
    file: null
  });

  const [formData, setFormData] = useState<ConcertUpdateForm>({
    name: '',
    concertDate: '',
    startTime: '',
    endTime: '',
    ticketPrice: '',
    peopleScale: '',
    songIds: []
  });

  // 내 노래 목록 가져오기
  const { data: mySongs, refetch: refetchSongs } = useQuery<SongDTO[]>({
    queryKey: ['songs', concertId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/songs/concert/${concertId}`);
      return data;
    },
    enabled: !!concertId
  });

  // 공연 정보 가져오기
  const { data: concert } = useQuery({
    queryKey: ['concert', concertId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/concerts/${concertId}`);
      setFormData({
        name: data.name,
        concertDate: data.concertDate,
        startTime: data.startTime,
        endTime: data.endTime,
        ticketPrice: data.ticketPrice,
        peopleScale: data.peopleScale,
        songIds: data.songs.map((song: SongDTO) => song.id)
      });
      return data;
    }
  });

  // 파일 업로드 mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    }
  });

  // 노래 등록 mutation
  const createSongMutation = useMutation({
    mutationFn: async ({ title, url }: { title: string; url: string }) => {
      const { data } = await apiClient.post('/songs', {
        title,
        url,
        artistId: userInfo?.userId,
        concertId: concertId,
        duration: 180
      });
      return data;
    },
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        songIds: [...prev.songIds, data.id]
      }));
      refetchSongs();
      setSongUploadForm({ title: '', file: null });
    }
  });

  // 공연 수정 mutation
  const updateConcertMutation = useMutation({
    mutationFn: async (updateData: ConcertUpdateForm) => {
      const loadingToast = toast.loading(t("상세정보_수정_중"));

      try {
        // 1. 새 이미지 업로드
        let newImageUrl = updateData.img;
        if (updateData.newImage) {
          const imageFormData = new FormData();
          imageFormData.append('file', updateData.newImage);
          const { data: uploadedImageUrl } = await apiClient.post('/files/upload', imageFormData);
          newImageUrl = uploadedImageUrl;
        }

        // 2. 공연 정보 업데이트
        await apiClient.put(`/concerts/${concertId}`, {
          ...updateData,
          img: newImageUrl
        });

        toast.success(t("상세정보_수정_성공"), { id: loadingToast });
        
        // 페이지 이동 제거하고 데이터 리프레시
        queryClient.invalidateQueries({ queryKey: ['concert', concertId] });
      } catch (error) {
        console.error('Error updating concert:', error);
        toast.error(t("상세정보_수정_실패"), { id: loadingToast });
        throw error;
      }
    }
  });

  // 노래 제거 mutation
  const removeSongMutation = useMutation({
    mutationFn: async (songId: number) => {
      try {
        // Song 엔티티와 파일 모두 삭제
        await apiClient.delete(`/songs/${songId}`);
        
        // 낙관적 업데이트
        setFormData(prev => ({
          ...prev,
          songIds: prev.songIds.filter(id => id !== songId)
        }));

        // 노래 목록 새로고침
        await refetchSongs();
      } catch (error) {
        console.error('Error deleting song:', error);
        throw error;
      }
    }
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSongUploadForm(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  const handleSongUpload = async () => {
    if (!songUploadForm.file || !songUploadForm.title) return;

    const loadingToast = toast.loading(t("노래_업로드_중"));  // 로딩 시작

    try {
      // 1. 파일 업로드
      const fileUrl = await uploadFileMutation.mutateAsync(songUploadForm.file);
      
      // 2. 노래 등록
      await createSongMutation.mutateAsync({
        title: songUploadForm.title,
        url: fileUrl
      });

      toast.success(t("노래_업로드_성공"), { id: loadingToast });  // 성공 메시지
    } catch (error) {
      console.error('Error uploading song:', error);
      toast.error(t("노래_업로드_실패"), { id: loadingToast });  // 실패 메시지
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConcertMutation.mutate(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const loadingToast = toast.loading(t("이미지_업로드_중"));

      // 낙관적 업데이트: 임시 URL 생성
      const tempImageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        img: tempImageUrl
      }));

      try {
        const formData = new FormData();
        formData.append('file', file);
        const { data: imageUrl } = await apiClient.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // 업로드 성공 시 실제 URL로 업데이트
        setFormData(prev => ({
          ...prev,
          img: imageUrl
        }));

        toast.success(t("이미지_업로드_성공"), { id: loadingToast });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(t("이미지_업로드_실패"), { id: loadingToast });

        // 업로드 실패 시 이전 상태로 롤백
        setFormData(prev => ({
          ...prev,
          img: concert?.img // 기존 이미지로 롤백
        }));
      } finally {
        // 임시 URL 해제
        URL.revokeObjectURL(tempImageUrl);
      }
    }
  };

  if (!concert) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">{t("공연_수정")}</h1>
      
      {/* 상세 정보 섹션 */}
      <div className="space-y-4 border rounded-lg p-6 bg-content1">
        <h2 className="text-xl font-semibold mb-4">{t("공연_상세정보")}</h2>
        
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
          {(formData.img || concert?.img) ? (  // formData.img를 우선 확인
            <>
              <Image
                alt={formData.name || concert?.name}
                src={formData.img || concert?.img}  // formData.img를 우선 사용
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity opacity-0 group-hover:opacity-100" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            color="primary"
            variant="solid"
            size="md"
            className="absolute bottom-4 right-4 shadow-lg bg-primary-500 hover:bg-primary-600 text-white z-10"
            onClick={() => imageInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t("이미지_변경")}
          </Button>
        </div>

        <Input
          label={t("공연_제목")}
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />

        <Input
          label={t("공연_날짜")}
          type="date"
          value={formData.concertDate}
          onChange={(e) => setFormData(prev => ({ ...prev, concertDate: e.target.value }))}
        />

        <div className="flex gap-4">
          <Input
            label={t("시작_시간")}
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
          />
          <Input
            label={t("종료_시간")}
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
          />
        </div>

        <Input
          label={t("티켓_가격")}
          value={formData.ticketPrice}
          onChange={(e) => setFormData(prev => ({ ...prev, ticketPrice: e.target.value }))}
        />

        <Input
          label={t("관객_규모")}
          value={formData.peopleScale}
          onChange={(e) => setFormData(prev => ({ ...prev, peopleScale: e.target.value }))}
        />

        {/* 상세 정보 수정 버튼 */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            color="danger"
            variant="light"
            onClick={() => router.push('/concerts/my-list')}
          >
            {t("취소")}
          </Button>
          <Button 
            color="primary" 
            type="submit"
            isLoading={updateConcertMutation.status === 'pending'}
          >
            {t("상세정보_수정")}
          </Button>
        </div>
      </div>

      {/* 공연곡 관리 섹션 */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold">{t("공연곡_관리")}</h2>

        {/* 노래 업로드 섹션 */}
        <div className="space-y-2 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{t("공연곡_추가")}</h3>
          <div className="flex gap-2 items-end">
            <Input
              label={t("노래_제목")}
              value={songUploadForm.title}
              onChange={(e) => setSongUploadForm(prev => ({ ...prev, title: e.target.value }))}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/mp3,audio/wav,audio/*"
              className="hidden"
            />
            <Button
              color="primary"
              onClick={handleFileSelect}
              className="h-[56px]"
            >
              {t("파일_선택")}
            </Button>
            <Button
              color="primary"
              onClick={handleSongUpload}
              isDisabled={!songUploadForm.file || !songUploadForm.title}
              className="h-[56px]"
            >
              {t("노래_등록")}
            </Button>
          </div>
          {songUploadForm.file && (
            <div className="text-sm text-gray-600">
              {t("선택된_파일")}: {songUploadForm.file.name}
            </div>
          )}
        </div>

        {/* 노래 목록 섹션 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t("공연곡_목록")}</h3>
          <div className="grid gap-2">
            {mySongs?.map((song) => (
              <Card key={song.id} className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-medium">{song.title}</span>
                  <Button
                    isIconOnly
                    color="danger"
                    onClick={async () => {
                      try {
                        await removeSongMutation.mutateAsync(song.id);
                        toast.success(t("노래_제거_성공"));
                      } catch (error) {
                        console.error('Error removing song:', error);
                        toast.error(t("노래_제거_실패"));
                      }
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
} 