declare module "adm-zip" {
  class AdmZip {
    constructor(bufferOrPath?: string | Buffer);
    getEntries(): AdmZip.ZipEntry[];
    extractAllTo(targetPath: string, overwrite: boolean): void;
    readAsText(entry: AdmZip.ZipEntry): string;
    getEntry(entryName: string): AdmZip.ZipEntry | null;
    addFile(entryName: string, content: Buffer, comment?: string): void;
    toBuffer(): Buffer;
    toString(): string;
  }

  namespace AdmZip {
    class ZipEntry {
      entryName: string;
      getData(): Buffer;
    }
  }

  export = AdmZip;
}
