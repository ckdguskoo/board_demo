import { useState, useEffect } from 'react';
import { boardApi } from '@/lib/api';
import { Board } from '@/types/board';

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardApi.getAll();
      setBoards(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : '게시글을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('게시글 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return {
    boards,
    loading,
    error,
    refetch: fetchBoards,
  };
};

