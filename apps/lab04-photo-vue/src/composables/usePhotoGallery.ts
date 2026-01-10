import { ref, watch, onMounted } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export const usePhotoGallery = () => {
  const photos = ref<UserPhoto[]>([]);

  // 🔑 key สำหรับเก็บรูปใน Preferences
  const PHOTO_STORAGE = 'photos';

  // 📸 ถ่ายรูป
  const addNewToGallery = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + '.jpeg';
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    photos.value = [savedImageFile, ...photos.value];
  };

  // 💾 บันทึกรูปลง Filesystem
  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = (await convertBlobToBase64(blob)) as string;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  // 🔄 blob → base64
  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  // 💾 save รายการรูปลง Preferences
  const cachePhotos = () => {
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  // 📥 โหลดรูปที่เคยบันทึกไว้
  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences: UserPhoto[] = photoList.value
      ? JSON.parse(photoList.value)
      : [];

    for (const photo of photosInPreferences) {
      const file = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }

    photos.value = photosInPreferences;
  };

  // 🚀 โหลดรูปเมื่อเปิดหน้า
  onMounted(loadSaved);

  // 👀 save อัตโนมัติเมื่อ photos เปลี่ยน
  watch(photos, cachePhotos);

  return {
    photos,
    addNewToGallery,
  };
};
