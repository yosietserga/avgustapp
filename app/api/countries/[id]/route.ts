import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: number } }) {
  try {
    const body = await request.json()
    const { name, code } = body

    const updatedCountry = await prisma.country.update({
      where: { id: params.id },
      data: {
        nombre:name,
        code,
      },
    })

    return NextResponse.json(updatedCountry)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating country' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.country.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ message: 'Country deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting country' }, { status: 500 })
  }
}