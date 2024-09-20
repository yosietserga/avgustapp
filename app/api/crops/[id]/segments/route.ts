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
    const segments = await prisma.segment.findMany({
      where: {
        objective: {
          crop: {
            id: cropId
          }
        }
      },
      include: {
        products: true,
        objective: {
          include: {
            crop: true
          }
        },
      },
    });

    return NextResponse.json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json({ message: "Error fetching segments" }, { status: 500 });
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
    const { objectiveId, ...segmentData } = body;

    const newSegment = await prisma.segment.create({
      data: {
        ...segmentData,
        objective: {
          connect: { id: objectiveId },
        },
        crop: {
          connect: { id: cropId }
        }
      },
    });
    return NextResponse.json(newSegment, { status: 201 });
  } catch (error) {
    console.error('Error creating segment:', error);
    return NextResponse.json({ message: "Error creating segment" }, { status: 500 });
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
    const { id, objectiveId, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "Segment ID is required" }, { status: 400 });
    }

    const updatedSegment = await prisma.segment.update({
      where: { 
        id: id,
        objective: {
          cropId: cropId
        }
      },
      data: {
        ...updateData,
        ...(objectiveId && {
          objective: {
            connect: {
              id: objectiveId,
              cropId: cropId
            }
          }
        }),
      },
    });

    return NextResponse.json(updatedSegment);
  } catch (error) {
    console.error('Error updating segment:', error);
    return NextResponse.json({ message: "Error updating segment" }, { status: 500 });
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
      return NextResponse.json({ message: "Segment ID is required" }, { status: 400 });
    }

    // First, check if the segment belongs to an objective of the specified crop
    const segment = await prisma.segment.findFirst({
      where: {
        id: id,
        objective: {
          cropId: cropId
        }
      }
    });

    if (!segment) {
      return NextResponse.json({ message: "Segment not found or does not belong to the specified crop" }, { status: 404 });
    }

    await prisma.segment.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Segment deleted successfully" });
  } catch (error) {
    console.error('Error deleting segment:', error);
    return NextResponse.json({ message: "Error deleting segment" }, { status: 500 });
  }
}