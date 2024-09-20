// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB default
const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(',');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the limit' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileType = await fileTypeFromBuffer(Buffer.from(buffer));

    if (!fileType || !ALLOWED_FILE_TYPES.includes(fileType.mime)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    const filename = `${uuidv4()}.${fileType.ext}`;
    const bucketName = process.env.S3_BUCKET_NAME!;

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: Buffer.from(buffer),
      ContentType: fileType.mime,
    });

    await s3Client.send(putObjectCommand);

    // Generate a signed URL for secure access
    const getObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 });

    return NextResponse.json({ fileUrl: signedUrl }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}