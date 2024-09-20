import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const SegmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  objectiveId: z.number().int().positive(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const segment = await prisma.segment.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!segment) return NextResponse.json({ message: "Segment not found" }, { status: 404 });
    return NextResponse.json(segment);
  } catch (error) {
    console.error('Error fetching segment:', error);
    return NextResponse.json({ message: "Error fetching segment" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const body = await request.json();
    const validatedData = SegmentSchema.parse(body);
    const updatedSegment = await prisma.segment.update({
      where: { id },
      data: validatedData,
    });
    return NextResponse.json(updatedSegment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error updating segment:', error);
    return NextResponse.json({ message: "Error updating segment" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.segment.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting segment:', error);
    return NextResponse.json({ message: "Error deleting segment" }, { status: 500 });
  }
}