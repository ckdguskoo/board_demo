'use client';

import { useRouter, useParams } from 'next/navigation';
import { useBoard } from '@/hooks/useBoard';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import Button from '@/components/Button';
import { formatDate } from '@/utils/date';
import Link from 'next/link';

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { board, loading, error } = useBoard(id);

  if (loading) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="container">
        <ErrorMessage message={error || '게시글을 찾을 수 없습니다.'} />
        <div className="error-actions">
          <Button variant="secondary" onClick={() => router.push('/')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <span className="lion-emoji">🦁</span>
          <h1>게시글 상세</h1>
        </div>
      </div>

      <div className="board-detail-card">
        <div className="board-detail-header">
          <h2 className="board-detail-title">{board.title}</h2>
          <div className="board-detail-meta">
            <span className="board-detail-author">작성자: {board.name}</span>
            <span className="board-detail-date">작성일: {formatDate(board.created_at)}</span>
            {board.updated_at && (
              <span className="board-detail-date">수정일: {formatDate(board.updated_at)}</span>
            )}
          </div>
        </div>
        
        <div className="board-detail-content">
          <div className="board-detail-text">
            {board.text.split('\n').map((line, index) => (
              <p key={index}>{line || '\u00A0'}</p>
            ))}
          </div>
        </div>

        <div className="board-detail-actions">
          <Link href="/">
            <Button variant="secondary">목록으로</Button>
          </Link>
          <Link href={`/edit/${board.id}`}>
            <Button variant="primary">수정하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

