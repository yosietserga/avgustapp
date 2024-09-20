import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = Number(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const stages = await prisma.stage.findMany({
      where: { 
        crop: {
          id: cropId
        }
      },
      include: {
        products: true,
        crop: true,
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = Number(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { objectiveId, ...stageData } = body;

    const newStage = await prisma.stage.create({
      data: {
        ...stageData,
        crop: {
          connect: {
            id: cropId
          }
        },
        objective: {
          connect: { id: objectiveId },
        },
      },
    });
    return NextResponse.json(newStage, { status: 201 });
  } catch (error) {
    console.error('Error creating stage:', error);
    return NextResponse.json({ message: "Error creating stage" }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = Number(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "Stage ID is required" }, { status: 400 });
    }

    const updatedStage = await prisma.stage.update({
      where: {
        id: id,
        cropId: cropId
      },
      data: updateData,
    });

    return NextResponse.json(updatedStage);
  } catch (error) {
    console.error('Error updating stage:', error);
    return NextResponse.json({ message: "Error updating stage" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cropId = Number(params.id);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Stage ID is required" }, { status: 400 });
    }

    await prisma.stage.delete({
      where: {
        id: id,
        cropId: cropId
      },
    });

    return NextResponse.json({ message: "Stage deleted successfully" });
  } catch (error) {
    console.error('Error deleting stage:', error);
    return NextResponse.json({ message: "Error deleting stage" }, { status: 500 });
  }
}