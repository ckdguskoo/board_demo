import axios, { AxiosError } from 'axios';
import { Board, BoardCreateRequest, BoardUpdateRequest } from '@/types/board';

// API URL 유효성 검사 및 기본값 설정
// 브라우저 환경에서는 현재 호스트를 기반으로 API URL 생성
const getApiBaseUrl = (): string => {
  // 1. 런타임 전역 변수 확인 (window.__NEXT_PUBLIC_API_URL__)
  if (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_API_URL__) {
    const runtimeUrl = (window as any).__NEXT_PUBLIC_API_URL__;
    if (runtimeUrl && runtimeUrl.trim() !== '') {
      try {
        new URL(runtimeUrl);
        return runtimeUrl;
      } catch (error) {
        console.warn('런타임 API URL이 유효하지 않습니다:', runtimeUrl);
      }
    }
  }

  // 2. 빌드 타임 환경 변수 확인
  let url = process.env.NEXT_PUBLIC_API_URL;
  
  // 3. 브라우저 환경에서 현재 호스트 기반으로 생성
  if (typeof window !== 'undefined') {
    // 환경 변수가 없거나 유효하지 않은 경우, 현재 호스트 기반으로 생성
    if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
      const currentHost = window.location.hostname;
      // localhost가 아닌 경우 (EC2 배포 환경)
      if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
        url = `http://${currentHost}:8080`;
        console.log('현재 호스트 기반 API URL 생성:', url);
      } else {
        url = 'http://localhost:8080';
      }
    }
  }

  // 4. 기본값 설정
  if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
    url = 'http://localhost:8080';
  }

  // 5. URL 형식 검증
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('잘못된 API URL 형식:', url, error);
    // 최종 폴백: 현재 호스트 기반
    if (typeof window !== 'undefined') {
      const fallbackUrl = `http://${window.location.hostname}:8080`;
      console.warn('기본 API URL 사용:', fallbackUrl);
      return fallbackUrl;
    }
    return 'http://localhost:8080';
  }
};

const API_BASE_URL = getApiBaseUrl();

// 디버깅용: API URL 로그 출력
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
}

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
