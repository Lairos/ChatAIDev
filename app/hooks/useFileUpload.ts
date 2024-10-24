import { useState } from 'react';
import { UploadedFile } from '../lib/types';

export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulating file upload with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setUploadProgress(100);

    // Return a mock UploadedFile object
    return {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };
  };

  return { uploadFile, uploadProgress, isUploading };
}
