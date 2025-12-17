import Link from 'next/link';
import { Board } from '@/types/board';
import { formatDate } from '@/utils/date';
import Button from './Button';

interface BoardListProps {
  boards: Board[];
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export default function BoardList({ boards, onDelete, isDeleting = false }: BoardListProps) {
  if (boards.length === 0) {
    return (
      <div className="empty-state">
        <p>등록된 게시글이 없습니다.</p>
        <Link href="/create">
          <Button>첫 게시글 작성하기</Button>
        </Link>
      </div>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: '45%' }}>제목</th>
          <th style={{ width: '15%' }}>작성자</th>
          <th style={{ width: '25%' }}>작성일</th>
          <th style={{ width: '15%' }}>작업</th>
        </tr>
      </thead>
      <tbody>
        {boards.map((board, index) => (
          <tr key={board.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <td>
              <Link
                href={`/edit/${board.id}`}
                style={{ 
                  color: '#64b5f6', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                {board.title}
              </Link>
            </td>
            <td>{board.name}</td>
            <td>{formatDate(board.created_at)}</td>
            <td>
              <div className="actions">
                <Link href={`/edit/${board.id}`}>
                  <Button
                    variant="secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    수정
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => onDelete(board.id)}
                  disabled={isDeleting}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  삭제
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

