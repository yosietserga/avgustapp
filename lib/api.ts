/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from './prisma'
import { query } from './db';

// Mock data for crops
const crops = [
  { id: 1, name: 'ARROZ', image: '/crops/rice.jpg' },
  { id: 2, name: 'TOMATE', image: '/crops/tomato.jpg' },
  { id: 3, name: 'MAÍZ', image: '/crops/corn.jpg' },
  // Add more crops as needed
];

interface CropDetail {
  name: string;
  description: string;
  image: string;
  stages: string[];
  managementPlans: {
    'weed-management': { stage: string; products: string[] }[];
    'pest-management': any[]; // Change 'any' to a more specific type if possible
    'disease-management': any[]; // Change 'any' to a more specific type if possible
    biostimulation: any[]; // Change 'any' to a more specific type if possible
    adjuvants: any[]; // Change 'any' to a more specific type if possible
  };
}

// Mock data for crop details
const cropDetails: { [key: number]: CropDetail } = {
  1: {
    name: 'ARROZ',
    description: 'El arroz en Colombia: motor económico y sustento familiar. El cultivo del arroz es esencial para la seguridad alimentaria y la economía del país. Descubre cómo manejar las plagas, las enfermedades y la productividad.',
    image: '/crops/rice-field.jpg',
    stages: ['Siembra', 'Emergencia', 'Macollamiento', 'Primordio floral'],
    managementPlans: {
      'weed-management': [
        { stage: 'Siembra', products: ['BROUNTER 757 WG', 'IRKUT EC', 'AFINNEX 400 EC', 'OXIFEN 240 EC'] },
        { stage: 'Emergencia', products: ['OXIFEN 240 EC', 'CHEKAN 500 WG', 'RICEMASTER 240 SC'] },
        { stage: 'Macollamiento', products: ['BAIKAL SC', 'OKUN 240 SC', 'BERKUT SL'] },
        { stage: 'Primordio floral', products: ['BOLO 180 EC'] },
      ],
      'pest-management': [
        // Add pest management data
      ],
      'disease-management': [
        // Add disease management data
      ],
      'biostimulation': [
        // Add biostimulation data
      ],
      'adjuvants': [
        // Add adjuvants data
      ],
    },
  },
  // Add details for other crops
};


export async function getCrops() {
  try {
    const crops = await prisma.crop.findMany()
    return crops
  } catch (error) {
    console.error('Error fetching crops:', error)
    throw new Error('Failed to fetch crops')
  }
}

export async function getCropData(id: number) {
  try {
    const crop = await prisma.crop.findUnique({
      where: { id },
    })
    return crop
  } catch (error) {
    console.error('Error fetching crop data:', error)
    throw new Error('Failed to fetch crop data')
  }
}

export async function createCrop(cropData: { name: string; image?: string; description?: string }) {
  try {
    const crop = await prisma.crop.create({
      data: cropData,
    })
    return crop
  } catch (error) {
    console.error('Error creating crop:', error)
    throw new Error('Failed to create crop')
  }
}

// Add more functions as needed


export async function updateCrop(id: number, cropData: { name: string, image?: File }) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const cropIndex = crops.findIndex(crop => crop.id === id);
  if (cropIndex === -1) {
    throw new Error('Crop not found');
  }

  // Update the crop
  crops[cropIndex] = {
    ...crops[cropIndex],
    name: cropData.name,
    image: cropData.image ? URL.createObjectURL(cropData.image) : crops[cropIndex].image,
  };

  return crops[cropIndex];
}

export async function deleteCrop(id: number) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const cropIndex = crops.findIndex(crop => crop.id === id);
  if (cropIndex === -1) {
    throw new Error('Crop not found');
  }

  // Remove the crop
  crops.splice(cropIndex, 1);
}

export async function submitEmail(email: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would send this email to your backend or email service
  console.log(`Email submitted: ${email}`);
  return { success: true, message: `Email ${email} submitted successfully!` };
}