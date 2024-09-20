import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const StageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  order: z.number().int().nonnegative(),
  description: z.string().optional(),
  cropId: z.number().int().positive(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const stage = await prisma.stage.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!stage) return NextResponse.json({ message: "Stage not found" }, { status: 404 });
    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error fetching stage:', error);
    return NextResponse.json({ message: "Error fetching stage" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const body = await request.json();
    const validatedData = StageSchema.parse(body);
    const updatedStage = await prisma.stage.update({
      where: { id },
      data: validatedData,
    });
    return NextResponse.json(updatedStage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error updating stage:', error);
    return NextResponse.json({ message: "Error updating stage" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.stage.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting stage:', error);
    return NextResponse.json({ message: "Error deleting stage" }, { status: 500 });
  }
}