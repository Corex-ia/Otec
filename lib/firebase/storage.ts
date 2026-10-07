import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';
import { LessonAttachment } from './firestore';

export type AssetType = 'pdf' | 'image' | 'video';
export type LegacyStorageFolder = 'courses/thumbnails' | 'courses/materials' | 'certificates';

export interface UploadOptions {
  courseId?: string;
  assetType?: AssetType;
}

export interface UploadResult {
  url: string;
  path: string;
  metadata: LessonAttachment;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percent: number;
  state: UploadTaskSnapshot['state'];
}

function detectAssetType(file: File): AssetType {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('video/')) return 'video';
  return 'image';
}

function buildStoragePath(file: File, options: UploadOptions): string {
  const type = options.assetType ?? detectAssetType(file);
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();

  if (options.courseId) {
    return `courses/${options.courseId}/${type}/${timestamp}_${sanitized}`;
  }

  const legacyFolderMap: Record<AssetType, LegacyStorageFolder> = {
    pdf: 'courses/materials',
    image: 'courses/thumbnails',
    video: 'courses/materials',
  };
  return `${legacyFolderMap[type]}/${timestamp}_${sanitized}`;
}

export function uploadFile(
  file: File,
  options: UploadOptions = {},
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const path = buildStoragePath(file, options);
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    const assetType = options.assetType ?? detectAssetType(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percent: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            state: snapshot.state,
          });
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const metadata: LessonAttachment = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          url,
          type: assetType,
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        resolve({ url, path, metadata });
      }
    );
  });
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif';
export const ACCEPTED_PDF_TYPES = 'application/pdf';
export const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/webm,video/ogg';

export type StorageFolder = LegacyStorageFolder;

export const FOLDER_CONFIG: Record<StorageFolder, { label: string; accept: string; maxSizeMB: number; assetType: AssetType }> = {
  'courses/thumbnails': {
    label: 'Imagen del Curso',
    accept: ACCEPTED_IMAGE_TYPES,
    maxSizeMB: 5,
    assetType: 'image',
  },
  'courses/materials': {
    label: 'Material del Curso (PDF)',
    accept: ACCEPTED_PDF_TYPES,
    maxSizeMB: 50,
    assetType: 'pdf',
  },
  certificates: {
    label: 'Diploma / Certificado',
    accept: ACCEPTED_PDF_TYPES,
    maxSizeMB: 10,
    assetType: 'pdf',
  },
};

export const COURSE_THUMBNAIL_FALLBACK =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80';
