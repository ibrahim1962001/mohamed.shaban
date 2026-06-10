"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "صورة المنتج",
}: ImageUploaderProps) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("الملف يجب أن يكون صورة");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("حجم الصورة أكبر من 8MB");
      return;
    }

    setUploading(true);
    setError("");
    setProgress("جاري رفع الصورة...");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الرفع");
      onChange(data.url);
      setProgress("تم رفع الصورة ✓");
      setTimeout(() => setProgress(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (galleryRef.current) galleryRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-100 bg-slate-50">
          <div className="relative aspect-video w-full max-h-64">
            <Image src={value} alt="معاينة" fill className="object-cover" />
          </div>
          <div className="flex gap-2 border-t border-indigo-100 bg-white p-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => galleryRef.current?.click()}
              className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-50"
            >
              تغيير الصورة
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4">
          <p className="mb-4 text-center text-sm text-slate-600">
            📱 اضغط لرفع صورة من الموبايل — الكاميرا أو المعرض
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => cameraRef.current?.click()}
              className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-indigo-600 py-4 text-white shadow-md transition active:scale-[0.98] disabled:opacity-50"
            >
              <span className="text-2xl">📷</span>
              <span className="text-sm font-bold">التقاط صورة</span>
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={() => galleryRef.current?.click()}
              className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-indigo-300 bg-white py-4 text-indigo-700 transition active:scale-[0.98] disabled:opacity-50"
            >
              <span className="text-2xl">🖼️</span>
              <span className="text-sm font-bold">اختيار من المعرض</span>
            </button>
          </div>
        </div>
      )}

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFiles}
      />

      {uploading && (
        <div className="flex items-center gap-2 rounded-xl bg-indigo-100 px-4 py-3 text-sm font-semibold text-indigo-700">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          {progress}
        </div>
      )}
      {!uploading && progress && (
        <p className="text-sm font-semibold text-green-600">{progress}</p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
