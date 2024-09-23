import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const StageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  order: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  cropId: z.number().int().positive(),
  objectiveId: z.number().int().positive(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cropId = searchParams.get('cropId');

  try {
    const stages = await prisma.stage.findMany({
      where: cropId ? { cropId: Number(cropId) } : undefined,
      include: {
        productsStart: true,
        productsEnd: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(stages);
  } catch (error) {
    console.error('Error fetching stages:', error);
    return NextResponse.json({ message: "Error fetching stages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = StageSchema.parse(body);
    
    const { objectiveId, cropId, name, order, ...stageData } = validatedData;

    const newStage = await prisma.stage.create({
      data: {
        ...stageData,
        name,
        order:order??1,
        crop: { connect: { id: cropId } },
        objective: { connect: { id: objectiveId } },
      },
    });
    return NextResponse.json(newStage, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error creating stage:', error);
    return NextResponse.json({ message: "Error creating stage" }, { status: 500 });
  }
}