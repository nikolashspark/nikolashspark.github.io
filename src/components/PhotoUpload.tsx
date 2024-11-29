import * as React from 'react';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ChangeEvent } from 'react';
import { VideoResponse } from '../types/video';

type PhotoFile = {
  file: File;
  preview: string;
};



const PhotoUpload = () => {
  const [photos, setPhotos] = React.useState<PhotoFile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    debugger;
    const files = event.target.files;
    if (!files) return;

    if (photos.length + files.length > 2) {
      setError('Можна завантажити максимум 2 фото');
      return;
    }

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;

    const newPhotos = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setError('');
  };

  const memoizedHandleRemovePhoto = React.useCallback((index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  }, []);

  const handleGenerateVideo = async () => {
    debugger;
    if (photos.length !== 2) {
      setError('Потрібно завантажити 2 фото');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photo${index + 1}`, photo.file);
      });

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/generate-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // TODO: Обробка відповіді
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка при генерації відео';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 25 * 3024 * 3024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setError('Непідтримуваний формат файлу');
      return false;
    }
    
    if (file.size > maxSize) {
      setError('Файл занадто великий');
      return false;
    }
    
    return true;
  };

  React.useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
        role="region"
        aria-label="Область завантаження фото"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
          aria-label="Виберіть фото для завантаження"
          multiple
        />
        <label 
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center"
          tabIndex={0}
        >
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
          <span className="mt-2 text-gray-600">
            Натисніть або перетягніть фо��о сюди
          </span>
        </label>
      </div>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo.preview}
                alt={`Фото ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => memoizedHandleRemovePhoto(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                aria-label="Видалити фото"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerateVideo}
        disabled={photos.length !== 2 || isLoading}
        className="mt-6 w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-busy={isLoading}
      >
        {isLoading ? 'Генерація відео...' : 'Згенерувати відео'}
      </button>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Генерація відео...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload; 