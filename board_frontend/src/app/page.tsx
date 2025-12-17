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
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next');

  // 현재 페이지에 표시할 게시글 계산
  const paginatedBoards = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return boards.slice(startIndex, endIndex);
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
    // 페이지 방향 결정
    const direction = page > currentPage ? 'next' : 'prev';
    setPageDirection(direction);
    
    // 애니메이션 시작
    setIsPageTransitioning(true);
    
    // 애니메이션 중간에 페이지 변경
    setTimeout(() => {
      setCurrentPage(page);
      // 페이지 변경 시 스크롤을 맨 위로
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300); // 애니메이션 중간 지점
    
    // 애니메이션 완료
    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 600); // 애니메이션 완료 시간
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <span className="lion-emoji">🦁</span>
          <h1>lion 게시판</h1>
        </div>
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <Link href="/create">
          <Button>글쓰기</Button>
        </Link>
      </div>

      <ErrorMessage message={error || ''} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div 
            className={`page-content ${isPageTransitioning ? `page-flip-${pageDirection}` : ''}`}
          >
            <BoardList
              boards={paginatedBoards}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
