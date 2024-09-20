import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  segmentId: z.number().int().positive().optional(),
  stageId: z.number().int().positive().optional(),
  startPercent: z.number().min(0).max(100).optional(),
  endPercent: z.number().min(0).max(100).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const segmentId = searchParams.get('segmentId');
  const stageId = searchParams.get('stageId');

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(segmentId && { segmentId: Number(segmentId) }),
        ...(stageId && { stageId: Number(stageId) }),
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ProductSchema.parse(body);
    const newProduct = await prisma.product.create({ data: validatedData });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}