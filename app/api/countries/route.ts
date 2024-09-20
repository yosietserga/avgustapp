import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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