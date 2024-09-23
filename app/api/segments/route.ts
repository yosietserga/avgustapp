import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const SegmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  cropId: z.number().int().positive(),
  objectiveId: z.number().int().positive(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const objectiveId = searchParams.get('objectiveId');

  try {
    const segments = await prisma.segment.findMany({
      where: objectiveId ? { objectiveId: Number(objectiveId) } : undefined,
      include: {
        products: true,
      },
    });
    return NextResponse.json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json({ message: "Error fetching segments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SegmentSchema.parse(body);
    const { objectiveId, cropId, name, ...segmentData } = validatedData;

    const newSegment = await prisma.segment.create({
      data: {
        ...segmentData,
        name,
        crop: { connect: { id: cropId } },
        objective: { connect: { id: objectiveId } },
      },
    });
    return NextResponse.json(newSegment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error creating segment:', error);
    return NextResponse.json({ message: "Error creating segment" }, { status: 500 });
  }
}