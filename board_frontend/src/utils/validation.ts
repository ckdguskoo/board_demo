/**
 * 게시글 폼 데이터 유효성 검사
 */
export interface FormData {
  title: string;
  name: string;
  text: string;
}

export const validateBoardForm = (formData: FormData): string | null => {
  if (!formData.title.trim()) {
    return '제목을 입력해주세요.';
  }
  
  if (!formData.name.trim()) {
    return '작성자를 입력해주세요.';
  }
  
  if (!formData.text.trim()) {
    return '내용을 입력해주세요.';
  }
  
  return null;
};

