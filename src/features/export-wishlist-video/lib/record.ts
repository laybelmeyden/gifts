import { VIDEO_FPS } from './timeline';

const MIME_TYPES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'] as const;

export function pickRecorderMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  return MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
}

export function recordCanvas(canvas: HTMLCanvasElement, mime: string) {
  const stream = canvas.captureStream(VIDEO_FPS);
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: BlobPart[] = [];
  const done = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      for (const track of stream.getTracks()) track.stop();
      resolve(new Blob(chunks, { type: mime.split(';')[0] }));
    };
    recorder.onerror = () => reject(new Error('record'));
  });
  recorder.start(200);
  return { recorder, done };
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
