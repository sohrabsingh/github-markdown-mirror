
declare module 'dompurify' {
  export interface DOMPurifyI {
    sanitize(dirty: string, options?: any): string;
    setConfig(cfg: any): DOMPurifyI;
    addHook(entryPoint: string, hookFunction: any): DOMPurifyI;
    removeHook(entryPoint: string): DOMPurifyI;
    isValidAttribute(tag: string, attr: string, value: string): boolean;
  }
  const dompurify: DOMPurifyI;
  export default dompurify;
}
