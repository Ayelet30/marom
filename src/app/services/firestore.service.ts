import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, query, where, doc, setDoc, runTransaction, CollectionReference, DocumentData, updateDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { ProvidersDetails } from '../models/providers-details.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  // הוספת ספק
  async addSupplier(collectionName: string, provider: any) {
    try {
      const collRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collRef, provider);
      console.log("Supplier added with ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding supplier: ", e);
      throw new Error("Error adding supplier");
    }
  }

 async addSupplierWithAutoAccountKey(collectionName: string, provider: ProvidersDetails) {
    const counterDocRef = doc(this.firestore, '/counters/suppliers');

    return await runTransaction(this.firestore, async (transaction) => {
      const counterSnap = await transaction.get(counterDocRef);

      let currentCount = 0;
      if (counterSnap.exists()) {
        currentCount = counterSnap.data()?.['lastSerial'] || 0;
      }

      const newAccountKey = currentCount + 1;

      // עדכון מונה
      transaction.set(counterDocRef, { lastSerial: newAccountKey }, { merge: true });

      // הגדרת accountKey בספק
      provider.accountKey = newAccountKey.toString(); 

      const collectionRef = collection(this.firestore, collectionName);
      const newDocRef = doc(collectionRef); 
      transaction.set(newDocRef, provider);

      return newDocRef.id;
    });
  }

  // הוספת משימה
  async addTask(collectionName: string, task: any) {
    try {
      console.log("add task", )
      const collRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collRef, task);
      console.log("task added: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding task: ", e);
      throw new Error("Error adding task");
    }
  }

  // קבלת מסמך על פי פרמטר
  async getDocumentByParameter(collectionName: string, parameter: string, value: string): Promise<any | null> {
    try {
      const collRef = collection(this.firestore, collectionName);
      const q = query(collRef, where(parameter, '==', value));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return docSnap.data();
      } else {
        console.log("No document found with parameter:", value);
        return null;
      }
    } catch (e) {
      console.error("Error getting document by parameter: ", e);
      throw new Error("Error getting document by parameter");
    }
  }

  // קבלת מסמכים על פי פרמטר
  async getDocumentsByParameter(collectionName: string, parameter: string, value: string): Promise<any[] | null> {
    try {
      const collRef = collection(this.firestore, collectionName);
      const q = query(collRef, where(parameter, '==', value));
      const querySnapshot = await getDocs(q);

return querySnapshot.empty
  ? null
  : querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

} catch (e) {
      console.error("Error getting documents by parameter: ", e);
      throw new Error("Error getting documents by parameter");
    }
  }

  // עדכון מסמך על פי taxFileNum
  async updateDocumentByTaxFileNum(collectionName: string, taxFileNum: string, providersDetails: Record<string, any>): Promise<boolean> {
    try {
      const collRef = collection(this.firestore, collectionName);
      const q = query(collRef, where("taxFileNum", "==", taxFileNum));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(this.firestore, collectionName, querySnapshot.docs[0].id);
        await setDoc(docRef, providersDetails, { merge: true });
        console.log("Document updated successfully.");
        return true;
      } else {
        console.log("No document found with taxFileNum:", taxFileNum);
        return false;
      }
    } catch (e) {
      console.error("Error updating document by taxFileNum:", e);
      throw new Error("Error updating document by taxFileNum");
    }
  }

  // קבלת כל המסמכים מתוך הקולקציה
  async getDocuments(collectionName: string): Promise<any[]> {
    try {
      const collRef = collection(this.firestore, collectionName);
      const querySnapshot = await getDocs(collRef);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (e) {
      console.error("Error getting documents: ", e);
      throw new Error("Error getting documents");
    }
  }
  async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    if (!docId) {
      throw new Error('docId is required');
    }

    const docRef = doc(this.firestore, collectionName, docId);
    return updateDoc(docRef, data);
  }
}