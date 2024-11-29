export interface VideoResponse {
    url: string;
    status: 'success' | 'error';
    message?: string;
  }