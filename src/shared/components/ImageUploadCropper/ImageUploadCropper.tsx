import React, { ChangeEvent, DragEvent, PointerEvent, useEffect, useRef, useState } from 'react';

import { classNames } from '@/shared/utils/classNames';

import * as styles from './ImageUploadCropper.module.scss';

export type ImageUploadCropperResult = {
  file: File;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  originalFile: File;
  originalWidth: number;
  originalHeight: number;
  crop: {
    aspectRatio: number;
    positionX: number;
    positionY: number;
    rotation: number;
    zoom: number;
  };
};

type SourceImage = {
  file: File;
  url: string;
  width: number;
  height: number;
  image: HTMLImageElement;
};

type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ImageUploadCropperProps = {
  label?: string;
  accept?: string;
  maxOriginalFileSizeMb?: number;
  disabled?: boolean;
  className?: string;
  onChange: (result: ImageUploadCropperResult | null) => void;
};

const OUTPUT_ASPECT_RATIO = 1;
const OUTPUT_WIDTH = 512;
const OUTPUT_TYPE = 'image/jpeg';
const TARGET_OUTPUT_SIZE_BYTES = 200 * 1024;
const MIN_JPEG_QUALITY = 0.45;
const MAX_JPEG_QUALITY = 0.92;
const QUALITY_SEARCH_STEPS = 7;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCropRect(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number,
  zoom: number,
  positionX: number,
  positionY: number
): CropRect {
  const imageRatio = imageWidth / imageHeight;
  const safeZoom = Math.max(1, zoom);
  const baseCrop =
    imageRatio > aspectRatio
      ? { width: imageHeight * aspectRatio, height: imageHeight }
      : { width: imageWidth, height: imageWidth / aspectRatio };
  const width = baseCrop.width / safeZoom;
  const height = baseCrop.height / safeZoom;
  const left = (imageWidth - width) * (positionX / 100);
  const top = (imageHeight - height) * (positionY / 100);

  return { left, top, width, height };
}

function drawCrop(
  canvas: HTMLCanvasElement,
  image: CanvasImageSource,
  crop: CropRect,
  width: number,
  height: number
) {
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return;

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, crop.left, crop.top, crop.width, crop.height, 0, 0, width, height);
}

function createRotatedImageCanvas(image: HTMLImageElement, rotation: number) {
  const canvas = document.createElement('canvas');
  const swapsDimensions = Math.abs(rotation) % 180 === 90;
  canvas.width = swapsDimensions ? image.naturalHeight : image.naturalWidth;
  canvas.height = swapsDimensions ? image.naturalWidth : image.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image rotation failed');

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((rotation * Math.PI) / 180);
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image compression failed'));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

async function createOptimizedJpeg(canvas: HTMLCanvasElement) {
  const minimumQualityBlob = await canvasToBlob(canvas, OUTPUT_TYPE, MIN_JPEG_QUALITY);

  if (minimumQualityBlob.size > TARGET_OUTPUT_SIZE_BYTES) {
    return minimumQualityBlob;
  }

  const maximumQualityBlob = await canvasToBlob(canvas, OUTPUT_TYPE, MAX_JPEG_QUALITY);

  if (maximumQualityBlob.size <= TARGET_OUTPUT_SIZE_BYTES) {
    return maximumQualityBlob;
  }

  let lowerQuality = MIN_JPEG_QUALITY;
  let upperQuality = MAX_JPEG_QUALITY;
  let bestBlob = minimumQualityBlob;

  for (let step = 0; step < QUALITY_SEARCH_STEPS; step += 1) {
    const quality = (lowerQuality + upperQuality) / 2;
    const blob = await canvasToBlob(canvas, OUTPUT_TYPE, quality);

    if (blob.size <= TARGET_OUTPUT_SIZE_BYTES) {
      bestBlob = blob;
      lowerQuality = quality;
    } else {
      upperQuality = quality;
    }
  }

  return bestBlob;
}

function getOutputFileName(fileName: string, outputType: string) {
  const extension = outputType.split('/')[1] || 'jpg';
  const baseName = fileName.replace(/\.[^/.]+$/, '') || 'image';
  return `${baseName}.${extension === 'jpeg' ? 'jpg' : extension}`;
}

export const ImageUploadCropper = ({
  label = 'Image',
  accept = 'image/*',
  maxOriginalFileSizeMb,
  disabled = false,
  className,
  onChange,
}: ImageUploadCropperProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotatedImageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const resultPreviewUrlRef = useRef<string | null>(null);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [error, setError] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);

  useEffect(() => {
    return () => {
      if (source) URL.revokeObjectURL(source.url);
      if (resultPreviewUrlRef.current) URL.revokeObjectURL(resultPreviewUrlRef.current);
    };
  }, [source]);

  useEffect(() => {
    rotatedImageCanvasRef.current = source
      ? createRotatedImageCanvas(source.image, rotation)
      : null;
  }, [rotation, source]);

  useEffect(() => {
    const rotatedImage = rotatedImageCanvasRef.current;
    if (!rotatedImage || !previewCanvasRef.current) return;

    const crop = getCropRect(
      rotatedImage.width,
      rotatedImage.height,
      OUTPUT_ASPECT_RATIO,
      zoom,
      positionX,
      positionY
    );
    const previewWidth = 900;
    const previewHeight = previewWidth;
    drawCrop(previewCanvasRef.current, rotatedImage, crop, previewWidth, previewHeight);
  }, [positionX, positionY, rotation, source, zoom]);

  async function loadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type');
      return;
    }

    if (maxOriginalFileSizeMb && file.size > maxOriginalFileSizeMb * 1024 * 1024) {
      setError(`File must be smaller than ${maxOriginalFileSizeMb} MB`);
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      setSource((currentSource) => {
        if (currentSource) URL.revokeObjectURL(currentSource.url);
        return {
          file,
          url,
          width: image.naturalWidth,
          height: image.naturalHeight,
          image,
        };
      });
      setRotation(0);
      setZoom(1);
      setPositionX(50);
      setPositionY(50);
      setError('');
      invalidateAppliedResult();
      onChange(null);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Image cannot be loaded');
    };

    image.src = url;
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) setIsDraggingFile(true);
  }

  function handleDragLeave() {
    setIsDraggingFile(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingFile(false);

    const file = event.dataTransfer.files?.[0];
    if (file && !disabled) void loadFile(file);
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (!source) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!isPanning || !lastPointerRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const deltaX = event.clientX - lastPointerRef.current.x;
    const deltaY = event.clientY - lastPointerRef.current.y;

    setPositionX((current) => clamp(current - (deltaX / rect.width) * 100, 0, 100));
    setPositionY((current) => clamp(current - (deltaY / rect.height) * 100, 0, 100));
    invalidateAppliedResult();
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsPanning(false);
    lastPointerRef.current = null;
  }

  function invalidateAppliedResult() {
    if (!resultPreviewUrlRef.current) return;

    URL.revokeObjectURL(resultPreviewUrlRef.current);
    resultPreviewUrlRef.current = null;
    onChange(null);
  }

  function handleRemove() {
    setSource((currentSource) => {
      if (currentSource) URL.revokeObjectURL(currentSource.url);
      return null;
    });
    setRotation(0);
    setError('');
    if (resultPreviewUrlRef.current) {
      URL.revokeObjectURL(resultPreviewUrlRef.current);
      resultPreviewUrlRef.current = null;
    }
    if (inputRef.current) inputRef.current.value = '';
    onChange(null);
  }

  function handleRotate(direction: -1 | 1) {
    setRotation((currentRotation) => (currentRotation + direction * 90 + 360) % 360);
    setPositionX(50);
    setPositionY(50);
    invalidateAppliedResult();
  }

  async function handleApply() {
    const rotatedImage = rotatedImageCanvasRef.current;
    if (!source || !rotatedImage || !outputCanvasRef.current) return;

    try {
      const crop = getCropRect(
        rotatedImage.width,
        rotatedImage.height,
        OUTPUT_ASPECT_RATIO,
        zoom,
        positionX,
        positionY
      );
      drawCrop(outputCanvasRef.current, rotatedImage, crop, OUTPUT_WIDTH, OUTPUT_WIDTH);

      const blob = await createOptimizedJpeg(outputCanvasRef.current);
      const file = new File([blob], getOutputFileName(source.file.name, OUTPUT_TYPE), {
        type: OUTPUT_TYPE,
        lastModified: Date.now(),
      });

      if (resultPreviewUrlRef.current) URL.revokeObjectURL(resultPreviewUrlRef.current);
      const previewUrl = URL.createObjectURL(blob);
      resultPreviewUrlRef.current = previewUrl;
      setError('');
      onChange({
        file,
        blob,
        previewUrl,
        width: OUTPUT_WIDTH,
        height: OUTPUT_WIDTH,
        originalFile: source.file,
        originalWidth: source.width,
        originalHeight: source.height,
        crop: {
          aspectRatio: OUTPUT_ASPECT_RATIO,
          positionX,
          positionY,
          rotation,
          zoom,
        },
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <section className={classNames(styles.cropper, className)}>
      <div
        className={classNames(
          styles.dropZone,
          isDraggingFile && styles.dropZoneActive,
          disabled && styles.dropZoneDisabled
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          className={styles.input}
          onChange={handleInputChange}
        />
        <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()}>
          {source ? 'Replace image' : `Upload ${label}`}
        </button>
        <span>{source ? source.file.name : 'Drop image'}</span>
      </div>

      {source && (
        <div className={styles.editor}>
          <canvas
            ref={previewCanvasRef}
            className={classNames(styles.preview, isPanning && styles.previewPanning)}
            style={{ aspectRatio: OUTPUT_ASPECT_RATIO }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          <div className={styles.controls}>
            <label>
              <span>Zoom</span>
              <input
                type="range"
                min="1"
                max="4"
                step="0.05"
                value={zoom}
                onChange={(event) => {
                  setZoom(Number(event.target.value));
                  invalidateAppliedResult();
                }}
              />
            </label>
            <div className={styles.rotationControl}>
              <span>Rotate</span>
              <div>
                <button
                  type="button"
                  aria-label="Rotate counterclockwise"
                  onClick={() => handleRotate(-1)}
                >
                  CCW
                </button>
                <button type="button" aria-label="Rotate clockwise" onClick={() => handleRotate(1)}>
                  CW
                </button>
              </div>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryAction} onClick={handleRemove}>
              Remove
            </button>
            <button type="button" className={styles.primaryAction} onClick={handleApply}>
              Apply image
            </button>
          </div>
        </div>
      )}

      {!source && error && <p className={styles.error}>{error}</p>}
      <canvas ref={outputCanvasRef} className={styles.outputCanvas} />
    </section>
  );
};
