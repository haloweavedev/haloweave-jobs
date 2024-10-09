import { NextResponse } from 'next/server';
import PDFParser from "pdf2json";

export async function POST(req: Request) {
  console.log('Received request to parse PDF');
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    console.log('No file uploaded');
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  console.log('File received:', file.name, 'Size:', file.size, 'bytes');
  const buffer = await file.arrayBuffer();

  try {
    console.log('Starting PDF parsing');
    const text = await extractTextFromPDF(Buffer.from(buffer));
    console.log('PDF parsed successfully. Extracted text length:', text.length);
    if (text.length === 0) {
      console.warn('Warning: Extracted text is empty');
    }
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1 as any); // Type assertion to fix the error
  
      pdfParser.on("pdfParser_dataError", errData => {
        console.error('PDF parsing error:', errData.parserError);
        reject(errData.parserError);
      });
      pdfParser.on("pdfParser_dataReady", pdfData => {
        console.log('PDF parsing completed');
        const text = pdfParser.getRawTextContent();
        console.log('Extracted text sample:', text.substring(0, 100));
        resolve(text);
      });
  
      console.log('Starting to parse PDF buffer, size:', pdfBuffer.length, 'bytes');
      pdfParser.parseBuffer(pdfBuffer);
    });
  }