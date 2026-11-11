import { useId, useRef, useState } from 'react';
import styles from './DocumentUpload.module.css';

interface Props {
  label: string;
  hint?: string;
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}

const ACCEPT = 'image/jpeg,image/png,application/pdf';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

export function DocumentUpload({ label, hint, file, error, onChange }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    const next = files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (next && next.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(next));
    } else {
      setPreviewUrl(null);
    }
    onChange(next);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const clear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const dropClasses = [
    styles.drop,
    dragging && styles.dragging,
    error && styles.hasError,
    file && styles.hasFile,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>

      <label
        htmlFor={inputId}
        className={dropClasses}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT}
          className={styles.input}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!file && (
          <div className={styles.placeholder}>
            <span className={styles.icon} aria-hidden>
              📎
            </span>
            <span className={styles.title}>
              Перетащите файл или нажмите
            </span>
            <span className={styles.sub}>JPG, PNG или PDF · до 10 МБ</span>
          </div>
        )}

        {file && (
          <div className={styles.file}>
            {previewUrl ? (
              <img src={previewUrl} alt="" className={styles.thumb} />
            ) : (
              <span className={`${styles.thumb} ${styles.thumbPdf}`}>PDF</span>
            )}
            <div className={styles.info}>
              <span className={styles.name} title={file.name}>
                {file.name}
              </span>
              <span className={styles.size}>{formatSize(file.size)}</span>
            </div>
            <button
              type="button"
              className={styles.clear}
              onClick={clear}
              aria-label="Удалить файл"
            >
              ✕
            </button>
          </div>
        )}
      </label>

      {hint && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}