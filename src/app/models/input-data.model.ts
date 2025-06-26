// src/app/models/input-data.model.ts
export interface InputData {
  id: string;
  label: string;
  error?: string;
  value: string;
  name: string;
  type: string;
  readonly?: string;
  maxlength?: string;
  requiredError?: string; // שגיאה לשדה ריק ❗️ נדרש להכניס...


}
