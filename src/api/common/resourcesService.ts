import { from, Observable } from 'rxjs';

export function useResourcesService() {
  const getImageAsFile = async (imageUrl: string): Promise<File> => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    return new File([blob], imageUrl.split('/').pop() || 'default.jpg', { type: 'image/jpeg' });
  };

  return {
    getImageAsFile,
  };
}

