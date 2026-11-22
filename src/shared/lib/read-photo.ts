const SIDES = [640, 480, 320];
const QUALITIES = [0.82, 0.65];

/** Ужимает картинку в webp data URL не длиннее maxLength символов. */
export async function readPhoto(file: File, maxLength: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    for (const side of SIDES) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of QUALITIES) {
        const url = canvas.toDataURL('image/webp', quality);
        if (url.length <= maxLength) return url;
      }
    }
  } finally {
    bitmap.close();
  }
  throw new Error('photo too big');
}
