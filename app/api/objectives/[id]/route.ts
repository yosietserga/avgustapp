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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const objective = await prisma.objective.findUnique({
      where: { id },
      include: {
        segments: {
          include: {
            products: true,
          },
        },
      },
    });
    if (!objective) return NextResponse.json({ message: "Objective not found" }, { status: 404 });
    return NextResponse.json(objective);
  } catch (error) {
    console.error('Error fetching objective:', error);
    return NextResponse.json({ message: "Error fetching objective" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const body = await request.json();
    const validatedData = ObjectiveSchema.parse(body);
    const updatedObjective = await prisma.objective.update({
      where: { id },
      data: validatedData,
    });
    return NextResponse.json(updatedObjective);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error updating objective:', error);
    return NextResponse.json({ message: "Error updating objective" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.objective.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting objective:', error);
    return NextResponse.json({ message: "Error deleting objective" }, { status: 500 });
  }
}