export interface ProvidersDetails {
    supplierId: string,             // מס עוסק מורשה
    name: string,                   // שם חברה
    bankNumber: string,             // מס בנק
    branchNumber: string,           // מס סניף
    accountNumber: string,          //מס חשבון
    address: string,                //כתובת
    phone: string,                  // פלאפון
    email: string,                  // אימייל
    DateHoldingTaxEffect: string,       // תוקף ניכוי במקור 
    DeductionPercentage: string,    // אחוזי ניכוי
    incomeTaxFile: string,          //תיק מס הכנסה
    ProjectName: string,             //שם הפרויקט
    BagType: string,                // סוג התיק
    Occupation: string,             // עיסוק
    NameFromCompany: string,        // איש קשר מטעם העסק
    mailFromCompany: string,        // מייל איש קשר מטעם עסק
    NameFromMarom: string,          // איש קשר מטעם מרום
    mailFromMarom: string           //מייל איש קשר מטעם מרום
}