import axios, { AxiosError } from 'axios';
import { Board, BoardCreateRequest, BoardUpdateRequest } from '@/types/board';

// API URL 유효성 검사 및 기본값 설정
const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  // 빈 문자열이나 undefined 체크
  if (!url || url.trim() === '') {
    console.warn('NEXT_PUBLIC_API_URL이 설정되지 않았습니다. 기본값을 사용합니다.');
    return 'http://localhost:8080';
  }
  // URL 형식 검증
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('잘못된 API URL 형식:', url, error);
    return 'http://localhost:8080';
  }
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 에러 처리 헬퍼 함수
const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message 
      || axiosError.message 
      || '요청 처리 중 오류가 발생했습니다.';
    return new Error(message);
  }
  
  if (error instanceof Error) {
    return error;
  }
  
  return new Error('알 수 없는 오류가 발생했습니다.');
};

export const boardApi = {
  /**
   * 전체 게시글 조회
   */
  getAll: async (): Promise<Board[]> => {
    try {
      const response = await apiClient.get<Board[]>('/api/board');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 게시글 생성
   */
  create: async (data: BoardCreateRequest): Promise<Board> => {
    try {
      const response = await apiClient.post<Board>('/api/board', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 게시글 수정
   */
  update: async (id: number, data: BoardUpdateRequest): Promise<Board> => {
    try {
      const response = await apiClient.put<Board>(`/api/board/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 단일 게시글 조회
   */
  getById: async (id: number): Promise<Board> => {
    try {
      const response = await apiClient.get<Board>(`/api/board/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * 게시글 삭제
   */
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/board/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
