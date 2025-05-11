import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(AngularFirestore);  // כאן משתמשים ב- AngularFirestore
  private auth = inject(Auth);

  constructor() {}

  // הוספת ספק
  async addSupplier(collectionName: string, provider: any) {
    try {
      const docRef = await this.firestore.collection(collectionName).add(provider); // משתמשים ב-add() להוספת מסמך
      console.log("Supplier added with ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding supplier: ", e);
      throw new Error("Error adding supplier");
    }
  }

   // הוספת משימה
   async addTask(collectionName: string, task: any) {
    try {
      console.log("11111111", task);
      const docRef = await this.firestore.collection(collectionName).add(task); // משתמשים ב-add() להוספת מסמך
      console.log("task add: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding task: ", e);
      throw new Error("Error adding task");
    }
  }

  // קבלת מסמך על פי 
  async getDocumentByParameter(collectionName: string, parameter: string, docId: string): Promise<any | null> {
    try {
      const querySnapshot = await this.firestore.collection(collectionName, ref => ref.where(parameter, "==", docId)).get().toPromise();

      if (!querySnapshot!.empty) {
        const docSnap = querySnapshot!.docs[0];
        console.log("Document found:", docSnap.data());
        return docSnap.data(); // מחזירים את המידע של המסמך
      } else {
        console.log("No document found with supplierId:", docId);
        return null;
      }
    } catch (e) {
      console.error("Error getting document by supplierId: ", e);
      throw new Error("Error getting document by supplierId");
    }
  }

   // קבלת מסמך על פי 
   async getDocumentsByParameter(collectionName: string, parameter: string, docId: string): Promise<any | null> {
    try {
      const querySnapshot = await this.firestore.collection(collectionName, ref => ref.where(parameter, "==", docId)).get().toPromise();

      if (!querySnapshot!.empty) {
        const docSnap = querySnapshot!.docs;
        return docSnap; // מחזירים את המידע של המסמך
      } else {
        console.log("No document found with supplierId:", docId);
        return null;
      }
    } catch (e) {
      console.error("Error getting document by supplierId: ", e);
      throw new Error("Error getting document by supplierId");
    }
  }

  // עדכון מסמך על פי supplierId
  async updateDocumentBySupplierId(collectionName: string, supplierId: string, providersDetails: Record<string, any>): Promise<boolean> {
    try {
      const querySnapshot = await this.firestore.collection(collectionName, ref => ref.where("supplierId", "==", supplierId)).get().toPromise();

      if (!querySnapshot!.empty) {
        const docRef = this.firestore.doc(`${collectionName}/${querySnapshot!.docs[0].id}`);
        await docRef.set(providersDetails, { merge: true });
        console.log("Document updated successfully.");
        return true;
      } else {
        console.log("No document found with supplierId:", supplierId);
        return false;
      }
    } catch (e) {
      console.error("Error updating document by supplierId:", e);
      throw new Error("Error updating document by supplierId");
    }
  }

  // קבלת כל המסמכים מתוך הקולקציה
  async getDocuments(collectionName: string): Promise<any[]> {
    try {
      const querySnapshot = await this.firestore.collection(collectionName).get().toPromise();
      const documents = querySnapshot!.docs.map(doc => doc.data());  // המרת התוצאות למערך של אובייקטים
      console.log(documents);  // אפשרי להדפיס את התוצאות
      return documents;  // מחזירים את המידע
    } catch (e) {
      console.error("Error getting documents: ", e);
      throw new Error("Error getting documents");
    }
  }
}
