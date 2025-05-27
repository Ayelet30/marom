export interface ProvidersDetails {
    sortGroup: string,              //קוד מיון 89
    accountKey: string,             // מפתח חשבון - מס סידורי < 20000
    taxFileNum: string,             // מס עוסק מורשה
    fullName: string,               // שם חשבון
    bankNumber: string,             // מס בנק
    branchNumber: string,           // מס סניף
    accountNumber: string,          //מס חשבון
    address: string,                // כתובת
    city: string,                   // עיר
    phone: string,                  // פלאפון
    email: string,                  // אימייל
    DateHoldingTaxEffect: string,   // תוקף ניכוי במקור 
    DeductionPercentage: string,    // אחוזי ניכוי
    deductFile: string,             // yתיק מס הכנסה
    ProjectName: string,            //שם הפרויקט
    BagType: string,                // סוג התיק
    Occupation: string,             // עיסוק
    NameFromCompany: string,        // איש קשר מטעם העסק
    mailFromCompany: string,        // מייל איש קשר מטעם עסק
    NameFromMarom: string,          // איש קשר מטעם מרום
    mailFromMarom: string           // מייל איש קשר מטעם מרום
}