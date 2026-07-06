import { v2 as cloudinary } from 'cloudinary';

const configured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export function isCloudinaryConfigured() {
  return configured;
}

export function getUploadConfig() {
  return {
    configured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
  };
}

export async function uploadBuffer(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<{ url: string; thumbnail?: string }> {
  if (!configured) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `skillnet/${folder}`,
        resource_type: resourceType,
      },
      (err, result) => {
        if (err || !result) {
          reject(err || new Error('Upload failed'));
          return;
        }
        const thumb =
          resourceType === 'video' && result.public_id
            ? cloudinary.url(result.public_id, {
                resource_type: 'video',
                format: 'jpg',
                transformation: [{ width: 400, height: 700, crop: 'fill' }],
              })
            : result.secure_url;
        resolve({
          url: result.secure_url,
          thumbnail: resourceType === 'video' ? thumb : result.secure_url,
        });
      }
    );
    stream.end(buffer);
  });
}
