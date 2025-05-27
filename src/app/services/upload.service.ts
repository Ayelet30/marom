// upload.service.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../models/firebase.config';

export const uploadFileToFirebase = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  console.log("11111111", storageRef);
  await uploadBytes(storageRef, file);
  console.log("22222222");
  const downloadUrl = await getDownloadURL(storageRef);
  console.log('✅ File uploaded. URL:', downloadUrl);
  return downloadUrl;
};
