import { useState } from 'react';
import { boardApi } from '@/lib/api';

export const useDeleteBoard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBoard = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await boardApi.delete(id);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : '게시글 삭제 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('게시글 삭제 오류:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteBoard,
    loading,
    error,
  };
};

