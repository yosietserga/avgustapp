import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const ObjectiveSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  cropId: z.number().int().positive(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cropId = searchParams.get('cropId');

  try {
    const objectives = await prisma.objective.findMany({
      where: cropId ? { cropId: Number(cropId) } : undefined,
      include: {
        segments: {
          include: {
            products: true,
          },
        },
      },
    });
    return NextResponse.json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return NextResponse.json({ message: "Error fetching objectives" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ObjectiveSchema.parse(body);
    const newObjective = await prisma.objective.create({ data: validatedData });
    return NextResponse.json(newObjective, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error creating objective:', error);
    return NextResponse.json({ message: "Error creating objective" }, { status: 500 });
  }
}