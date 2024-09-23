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
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            startStage: {
              cropId: cropId
            }
          },
          {
            endStage: {
              cropId: cropId
            }
          },
          {
            segment: {
              objective: {
                cropId: cropId
              }
            },
          },
        ],
      },
      include: {
        startStage: {
          include: {
            crop: true
          }
        },
        endStage: {
          include: {
            crop: true
          }
        },
        segment: {
          include: {
            objective: {
              include: {
                crop: true
              }
            }
          }
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { cropId: string } }
) {
  const cropId = Number(params.cropId);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { stageId, segmentId, ...productData } = body;

    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        ...(stageId && {
          stage: {
            connect: {
              id: stageId,
              crop: {
                id: cropId
              }
            },
          },
        }),
        ...(segmentId && {
          segment: {
            connect: {
              id: segmentId,
              objective: {
                crop: {
                  id: cropId
                }
              }
            },
          },
        }),
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}



export async function PUT(
  request: NextRequest,
  { params }: { params: { cropId: string } }
) {
  const cropId = Number(params.cropId);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { id, stageId, segmentId, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        ...(stageId && {
          stage: {
            connect: {
              id: stageId,
              cropId: cropId
            }
          }
        }),
        ...(segmentId && {
          segment: {
            connect: {
              id: segmentId,
              objective: {
                cropId: cropId
              }
            }
          }
        }),
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { cropId: string } }
) {
  const cropId = Number(params.cropId);

  if (isNaN(cropId)) {
    return NextResponse.json({ message: "Invalid crop ID" }, { status: 400 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // First, check if the product belongs to the specified crop
    const product = await prisma.product.findFirst({
      where: {
        id,
        OR: [
          {
            startStage: {
              cropId: cropId
            }
          },
          {
            endStage: {
              cropId: cropId
            }
          },
          { segment: { objective: { cropId } } }
        ]
      }
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found or does not belong to the specified crop" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}