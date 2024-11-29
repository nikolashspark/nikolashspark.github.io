import { VideoResponse } from '../types/video';

export const generateVideo = async (formData: FormData): Promise<VideoResponse> => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  const response = await fetch(`${API_URL}/api/generate-video`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
