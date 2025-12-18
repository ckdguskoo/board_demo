'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useBoards } from '@/hooks/useBoards';
import { useDeleteBoard } from '@/hooks/useDeleteBoard';
import BoardList from '@/components/BoardList';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import Button from '@/components/Button';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const { boards, loading, error, refetch } = useBoards();
  const { deleteBoard, loading: isDeleting } = useDeleteBoard();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTransitionDirection, setPageTransitionDirection] = useState<'next' | 'prev' | null>(null);

  // 현재 페이지에 표시할 게시글 계산 (최신순 정렬)
  const paginatedBoards = useMemo(() => {
    // 최신 글이 맨 위에 오도록 created_at 기준 내림차순 정렬
    const sortedBoards = [...boards].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // 내림차순 (최신이 먼저)
    });
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedBoards.slice(startIndex, endIndex);
  }, [boards, currentPage]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    return Math.ceil(boards.length / ITEMS_PER_PAGE);
  }, [boards.length]);

  // 게시글이 변경되면 첫 페이지로 이동
  useEffect(() => {
    if (boards.length > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [boards.length, currentPage, totalPages]);

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteBoard(id);
      await refetch();
      // 삭제 후 현재 페이지에 게시글이 없으면 이전 페이지로 이동
      if (paginatedBoards.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    
    setPageTransitionDirection(page > currentPage ? 'next' : 'prev');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <span className="lion-emoji">🦁</span>
          <h1>lion 게시판</h1>
        </div>
      </div>

      <div className="create-button-container">
        <Link href="/create">
          <Button>글쓰기</Button>
        </Link>
      </div>

      <ErrorMessage message={error || ''} />

      {loading ? (
        <Loading />
      ) : (
        <div className={`page-transition ${pageTransitionDirection === 'next' ? 'page-transition-next' : ''} ${pageTransitionDirection === 'prev' ? 'page-transition-prev' : ''}`}>
          <BoardList
            boards={paginatedBoards}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
