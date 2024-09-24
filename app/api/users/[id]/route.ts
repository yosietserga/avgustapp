import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: { id: true, email: true, name: true, countryId: true }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { name, countryId } = body;

  const updatedUser = await prisma.user.update({
    where: { id: Number(params.id) },
    data: { name, countryId },
    select: { id: true, email: true, name: true, countryId: true }
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: 'User deleted successfully' });
}