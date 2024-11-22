import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY!);

interface Invoice {
  serialNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  tax: number;
  totalAmount: number;
  date: string;
}

interface Product {
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  priceWithTax: number;
}

interface Customer {
  name: string;
  Mobile: string;
  Email: string;
  totalPurchaseAmount: number;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel') {
      // Handle Excel file
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const invoices: Invoice[] = [];
      const products: Product[] = [];
      const customers = new Map<string, Customer>();

      jsonData.forEach((row: any) => {
        // Process invoice data
        const invoice: Invoice = {
          serialNumber: row['Serial Number'] || '',
          customerName: row['Party Name'] || '',
          productName: row['Product Name'] || '',
          quantity: Number(row['Qty']) || 0,
          tax: Number(row['Tax']) || 0,
          totalAmount: Number(row['Total Amount']) || 0,
          date: row['Invoice Date'] || '',
        };
        invoices.push(invoice);

        // Process product data
        const product: Product = {
          name: row['Product Name'] || '',
          quantity: Number(row['Quantity']) || 0,
          unitPrice: Number(row['Unit Price']) || 0,
          tax: Number(row['Tax']) || 0,
          priceWithTax: Number(row['Price with Tax']) || 0,
        };
        products.push(product);

        // Process customer data
        const customerName = row['Customer Name'];
        if (customerName && !customers.has(customerName)) {
          customers.set(customerName, {
            name: customerName,
            Mobile: row['Mobile'] || '',
            Email: row['Email'] || '',
            totalPurchaseAmount: Number(row['Total Amount']) || 0,
          });
        } else if (customerName) {
          const customer = customers.get(customerName)!;
          customer.totalPurchaseAmount += Number(row['Total Amount']) || 0;
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          invoices,
          products,
          customers: Array.from(customers.values()),
        },
      });
    } else {
      // PDF or image file processing
      if (!process.env.NEXT_PUBLIC_API_KEY) {
        console.error('GEMINI_API_KEY is not set')
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
      }

      const fileBuffer = await file.arrayBuffer()

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const prompt = `Extract invoice data from this file. Return the data as a JSON object with the following structure:
          {
            "invoices": [
              {
                "serialNumber": "string",
                "customerName": "string",
                "productName": "string",
                "quantity": number,
                "tax": number,
                "totalAmount": number,
                "date": "string"
              }
            ],
            "products": [
              {
                "name": "string",
                "quantity": number,
                "unitPrice": number,
                "tax": number,
                "priceWithTax": number
              }
            ],
            "customers": [
              {
                "name": "string",
                "Mobile": "string",
                "Email": "string",
                "totalPurchaseAmount": number
              }
            ]
          }
          Important: Return ONLY the JSON object, without any additional text or formatting.`

        console.log('Sending request to Gemini API')

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.type,
              data: Buffer.from(fileBuffer).toString('base64')
            }
          },
          prompt
        ])

        console.log('Received response from Gemini API')

        const response = await result.response
        let text = response.text()


        if (!text) {
          console.error('Empty response from Gemini API')
          return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
        }

        // Clean up the response
        text = text.replace(/```json\s?|\s?```/g, '').trim()

        try {
          const parsedData = JSON.parse(text)
          return NextResponse.json({
            success: true,
            data: parsedData
          })
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError)
          return NextResponse.json({ error: 'Invalid response format from AI', details: text }, { status: 500 })
        }
      } catch (aiError: any) {
        console.error('Error calling Gemini API:', aiError)
        return NextResponse.json({
          error: 'Error processing with AI',
          details: aiError.message || 'Unknown error occurred'
        }, { status: 500 })
      }
    }
  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({
      error: 'Error processing file',
      details: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}

