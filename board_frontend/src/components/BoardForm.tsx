import { FormEvent, ChangeEvent } from 'react';
import ErrorMessage from './ErrorMessage';
import Button from './Button';

export interface BoardFormData {
  title: string;
  name: string;
  text: string;
}

interface BoardFormProps {
  formData: BoardFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
  cancelLabel?: string;
}

export default function BoardForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  error,
  submitLabel = '저장',
  cancelLabel = '취소',
}: BoardFormProps) {
  return (
    <div className="card">
      <ErrorMessage message={error || ''} />

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="제목을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">작성자</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="작성자 이름을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="text">내용</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={onChange}
            placeholder="내용을 입력하세요"
            required
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? '처리 중...' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

