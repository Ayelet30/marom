import { Injectable } from '@angular/core';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private storage = getStorage(); 

  async uploadFile(file: File): Promise<string> {
    const filePath = `uploads/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath); 
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  }
}
