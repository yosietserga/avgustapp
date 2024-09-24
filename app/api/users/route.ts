import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, countryId: true }
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, countryId } = body;

  if (!email || !password || !countryId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, countryId }
  });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, countryId: user.countryId });
}