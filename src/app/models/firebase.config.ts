import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: "AIzaSyCiGz6RP0PuGkPK5W31KEqWzPx7aQuq-tM",
      authDomain: "marom-9f242.firebaseapp.com", // אמור להיות app.com לא .storage.app
      projectId: "marom-9f242", // ה-id של הפרויקט ב-Firebase
      storageBucket: "marom-9f242.appspot.com", // ה-storage bucket שלך
      messagingSenderId: "361323286558",
      appId: "1:361323286558:web:C9F9DCAA439A38E06DDE0F"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
