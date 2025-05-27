
export function buildPluginData(fields: { key: string; value: any }[]): any {
  const obj: any = {};
  for (const field of fields) {
    if (field.key && field.value !== undefined) {
      obj[field.key] = field.value;
    }
  }
  return obj;
}
