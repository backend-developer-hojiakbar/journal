// Upload testing utility
import apiClient from '../api/axiosConfig';

export const testFileUpload = async (file: File, endpoint: string = '/news/') => {
  console.log('=== Upload Test Started ===');
  console.log(`File: ${file.name}`);
  console.log(`Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Type: ${file.type}`);
  console.log(`Endpoint: ${endpoint}`);
  
  const formData = new FormData();
  formData.append('title', 'Test Upload');
  formData.append('content', 'This is a test upload to check file size limits');
  formData.append('image', file);
  
  const startTime = Date.now();
  
  try {
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      }
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('✅ Upload successful!');
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    console.log('Response:', response.data);
    
    return { success: true, data: response.data, duration };
    
  } catch (error: any) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('❌ Upload failed!');
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    
    if (error.code === 'ECONNABORTED') {
      console.log('Error: Request timeout');
      return { success: false, error: 'TIMEOUT', duration };
    } else if (error.response) {
      console.log(`Error: HTTP ${error.response.status} - ${error.response.statusText}`);
      console.log('Response data:', error.response.data);
      return { 
        success: false, 
        error: `HTTP_${error.response.status}`, 
        data: error.response.data,
        duration 
      };
    } else {
      console.log('Error: Network or other error');
      console.log('Error message:', error.message);
      return { success: false, error: 'NETWORK_ERROR', message: error.message, duration };
    }
  }
};

export const createTestFile = (sizeInMB: number, fileName: string = 'test-file.txt'): File => {
  const size = sizeInMB * 1024 * 1024; // Convert MB to bytes
  const buffer = new ArrayBuffer(size);
  const view = new Uint8Array(buffer);
  
  // Fill with some data to make it a realistic file
  for (let i = 0; i < size; i += 1024) {
    const chunk = Math.min(1024, size - i);
    for (let j = 0; j < chunk; j++) {
      view[i + j] = (i + j) % 256;
    }
  }
  
  const blob = new Blob([buffer], { type: 'text/plain' });
  return new File([blob], fileName, { type: 'text/plain' });
};

// Quick test functions for the console
export const quickTest = {
  test1MB: () => testFileUpload(createTestFile(1, 'test-1mb.txt')),
  test4MB: () => testFileUpload(createTestFile(4, 'test-4mb.txt')),
  test10MB: () => testFileUpload(createTestFile(10, 'test-10mb.txt')),
  test20MB: () => testFileUpload(createTestFile(20, 'test-20mb.txt')),
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).uploadTester = { testFileUpload, createTestFile, quickTest };
}