import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CropSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const crop = await prisma.crop.findUnique({
      where: { id },
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
        segments: {
          include: {
            products: true,
          },
        },
        stages: {
          include: {
            productsStart: true,
            productsEnd: true,
          },
        },
      },
    });
    if (!crop) return NextResponse.json({ message: "Crop not found" }, { status: 404 });
    return NextResponse.json(crop);
  } catch (error) {
    console.error('Error fetching crop:', error);
    return NextResponse.json({ message: "Error fetching crop" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    const body = await request.json();
    const validatedData = CropSchema.parse(body);
    const updatedCrop = await prisma.crop.update({
      where: { id },
      data: validatedData,
    });
    return NextResponse.json(updatedCrop);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error updating crop:', error);
    return NextResponse.json({ message: "Error updating crop" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.crop.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting crop:', error);
    return NextResponse.json({ message: "Error deleting crop" }, { status: 500 });
  }
}