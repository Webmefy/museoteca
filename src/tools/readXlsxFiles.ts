import { Product } from "../shared/interfaces/product-xlsx";
import * as xlsx from 'xlsx';

export function readXlsxFile(filePath: string): Product[] {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json<any>(worksheet);
  
  return rawData.map((item: any) => ({
    imageId: item['Image ID'] || item['ID'] || '',
    title: item['Title'] || '',
    author: item['Author'] || ''
  })) as Product[];
}
