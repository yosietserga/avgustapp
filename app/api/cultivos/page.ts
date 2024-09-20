import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Read - Get all items or a single item
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (id) {
      const item = await prisma.item.findUnique({
        where: { id: Number(id) },
      });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.status(200).json(item);
    } else {
      const items = await prisma.item.findMany();
      return res.status(200).json(items);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching data" });
  }
}

// Create - Add a new item
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, description } = req.body;

  try {
    const newItem = await prisma.item.create({
      data: { name, description },
    });
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({ message: "Error creating item" });
  }
}

// Update - Modify an existing item
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, description } = req.body;

  try {
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: { name, description },
    });
    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: "Error updating item" });
  }
}

// Delete - Remove an item
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Error deleting item" });
  }
}
