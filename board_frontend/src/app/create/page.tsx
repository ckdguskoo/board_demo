'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateBoard } from '@/hooks/useCreateBoard';
import { validateBoardForm } from '@/utils/validation';
import BoardForm, { BoardFormData } from '@/components/BoardForm';

export default function CreatePage() {
  const router = useRouter();
  const { createBoard, loading, error } = useCreateBoard();
  const [formData, setFormData] = useState<BoardFormData>({
    title: '',
    name: '',
    text: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

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
      await createBoard(formData);
    } catch (err) {
      // 에러는 useCreateBoard에서 처리됨
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>게시글 작성</h1>
      </div>

      <BoardForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error || validationError}
        submitLabel="작성하기"
      />
    </div>
  );
}
