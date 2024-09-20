import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


//todo: add GET method to fetch all countries with name or code filters as parameter 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('countryId');
  const nombre = searchParams.get('name');
  const code = searchParams.get('code');

  try {
    const countries = await prisma.country.findMany({
      where: {
        ...(countryId && { countryId: Number(countryId) }),
        ...(nombre && { nombre: String(nombre) }),
        ...(code && { code: String(code) }),
      },
    });
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ message: "Error fetching countries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, code } = body

    const newCountry = await prisma.country.create({
      data: {
        nombre,
        code,
      },
    })

    return NextResponse.json(newCountry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating country' }, { status: 500 })
  }
}