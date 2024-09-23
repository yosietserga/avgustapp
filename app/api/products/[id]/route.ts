import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  productType: z.enum(['insecticida', 'fungicida', 'herbicida', 'nutricion', 'feromonas', 'otros_insumos']),
  cropId: z.number().int().positive().optional(),
  objectiveId: z.number().int().positive().optional(),
  segmentId: z.number().int().positive().optional(),
  startStageId: z.number().int().positive().optional(),
  endStageId: z.number().int().positive().optional(),
  startPercent: z.number().min(0).max(100).optional(),
  endPercent: z.number().min(0).max(100).optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        segment: true,
        startStage: true,
        endStage: true,
        objective: true,
      },
    });
    if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const body = await request.json();
    const validatedData = ProductSchema.parse({
      ...body,
      image:body.image||''
    });
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validatedData,
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error updating product:', error);
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}