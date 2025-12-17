'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBoard } from '@/hooks/useBoard';
import { useUpdateBoard } from '@/hooks/useUpdateBoard';
import { validateBoardForm } from '@/utils/validation';
import BoardForm, { BoardFormData } from '@/components/BoardForm';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import Button from '@/components/Button';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { board, loading: fetchLoading, error: fetchError } = useBoard(id);
  const { updateBoard, loading, error } = useUpdateBoard();
  const [formData, setFormData] = useState<BoardFormData>({
    title: '',
    name: '',
    text: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (board) {
      setFormData({
        title: board.title,
        name: board.name,
        text: board.text,
      });
    }
  }, [board]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    const validationResult = validateBoardForm(formData);
    if (validationResult) {
      setValidationError(validationResult);
      return;
    }

    try {
      await updateBoard(id, formData);
    } catch (err) {
      // 에러는 useUpdateBoard에서 처리됨
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (fetchLoading) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  if (fetchError || !board) {
    return (
      <div className="container">
        <ErrorMessage message={fetchError || '게시글을 찾을 수 없습니다.'} />
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
        <h1>게시글 수정</h1>
      </div>

      <BoardForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error || validationError}
        submitLabel="수정하기"
      />
    </div>
  );
}
