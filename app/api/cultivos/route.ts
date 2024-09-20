// app/api/cultivos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for crop validation
const CropSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  description: z.string().optional(),
});

// GET /api/cultivos
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const crop = await prisma.crop.findUnique({
        where: { id: Number(id) },
      });
      if (!crop) {
        return NextResponse.json({ message: "Crop not found" }, { status: 404 });
      }
      return NextResponse.json(crop);
    } else {
      const crops = await prisma.crop.findMany();
      return NextResponse.json(crops);
    }
  } catch (error) {
    console.error('Error fetching crops:', error);
    return NextResponse.json({ message: "Error fetching crops" }, { status: 500 });
  }
}

// POST /api/cultivos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CropSchema.parse(body);

    const newCrop = await prisma.crop.create({
      data: validatedData,
    });
    return NextResponse.json(newCrop, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 });
    }
    console.error('Error creating crop:', error);
    return NextResponse.json({ message: "Error creating crop" }, { status: 500 });
  }
}

// PUT /api/cultivos?id=:id
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: "Missing crop ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validatedData = CropSchema.parse(body);

    const updatedCrop = await prisma.crop.update({
      where: { id: Number(id) },
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

// DELETE /api/cultivos?id=:id
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: "Missing crop ID" }, { status: 400 });
  }

  try {
    await prisma.crop.delete({
      where: { id: Number(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting crop:', error);
    return NextResponse.json({ message: "Error deleting crop" }, { status: 500 });
  }
}