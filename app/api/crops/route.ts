import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CropSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  country_id: z.number().optional()
});

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        objectives: {
          include: {
            segments: {
              include: {
                products: true,
              },
            },
          },
        },
        stages: {
          include: {
            products: true,
          },
        },
      },
    });
    return NextResponse.json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    return NextResponse.json({ message: "Error fetching crops" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CropSchema.parse(body);
    const newCrop = await prisma.crop.create({ data: validatedData });
    return NextResponse.json(newCrop, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error creating crop:', error);
    return NextResponse.json({ message: "Error creating crop" }, { status: 500 });
  }
}