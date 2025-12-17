export interface Board {
  id: number;
  title: string;
  name: string;
  text: string;
  created_at: string;
  updated_at: string | null;
}

export interface BoardCreateRequest {
  title: string;
  name: string;
  text: string;
}

export interface BoardUpdateRequest {
  title: string;
  name: string;
  text: string;
}

