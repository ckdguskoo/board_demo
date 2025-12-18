import { useState, useEffect } from 'react';
import { boardApi } from '@/lib/api';
import { Board } from '@/types/board';

export const useBoard = (id: number | null) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedBoard = await boardApi.getById(id);
        setBoard(fetchedBoard);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : '게시글을 불러오는 중 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('게시글 조회 오류:', err);
        setBoard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  return {
    board,
    loading,
    error,
  };
};

