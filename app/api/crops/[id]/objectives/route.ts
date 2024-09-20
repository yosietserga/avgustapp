// File: app/api/crops/[id]/objectives/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = parseInt(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ error: 'Invalid crop ID' }, { status: 400 });
  }

  try {
    const objectives = await prisma.objective.findMany({
      where: { cropId: cropId },
      include: {
        segments: true,
      },
    });

    return NextResponse.json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = parseInt(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ error: 'Invalid crop ID' }, { status: 400 });
  }

  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newObjective = await prisma.objective.create({
      data: {
        name,
        cropId,
      },
    });

    return NextResponse.json(newObjective, { status: 201 });
  } catch (error) {
    console.error('Error creating objective:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = parseInt(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ error: 'Invalid crop ID' }, { status: 400 });
  }

  try {
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    const updatedObjective = await prisma.objective.update({
      where: { id: id, cropId: cropId },
      data: { name },
    });

    return NextResponse.json(updatedObjective);
  } catch (error) {
    console.error('Error updating objective:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = parseInt(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ error: 'Invalid crop ID' }, { status: 400 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Objective ID is required' }, { status: 400 });
    }

    await prisma.objective.delete({
      where: { id: id, cropId: cropId },
    });

    return NextResponse.json({ message: 'Objective deleted successfully' });
  } catch (error) {
    console.error('Error deleting objective:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}