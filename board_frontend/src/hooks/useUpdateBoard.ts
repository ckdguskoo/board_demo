import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { boardApi } from '@/lib/api';
import { BoardUpdateRequest } from '@/types/board';

export const useUpdateBoard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBoard = async (id: number, data: BoardUpdateRequest) => {
    try {
      setLoading(true);
      setError(null);
      await boardApi.update(id, data);
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : '게시글 수정 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('게시글 수정 오류:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateBoard,
    loading,
    error,
  };
};

