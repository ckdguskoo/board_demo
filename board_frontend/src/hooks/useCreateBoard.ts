import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { boardApi } from '@/lib/api';
import { BoardCreateRequest } from '@/types/board';

export const useCreateBoard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBoard = async (data: BoardCreateRequest) => {
    try {
      setLoading(true);
      setError(null);
      await boardApi.create(data);
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : '게시글 작성 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('게시글 작성 오류:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBoard,
    loading,
    error,
  };
};

