"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { setProductImages } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function ProductImageManager({
  slug,
  images: initial,
}: {
  slug: string;
  images: string[];
}) {
  const [images, setImages] = useState<string[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function persist(next: string[]) {
    setImages(next);
    startTransition(async () => {
      const result = await setProductImages(slug, next);
      if (result.error) setError(result.error);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setUploading(true);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`${file.name}: only JPG, PNG, WebP or AVIF are allowed.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`${file.name} is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is 5MB.`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      // Timestamped path keeps re-uploads from colliding and busts any CDN
      // cache on the old file.
      const path = `${slug}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (uploaded.length) persist([...images, ...uploaded]);
  }

  function remove(url: string) {
    persist(images.filter((i) => i !== url));
  }

  function makePrimary(url: string) {
    persist([url, ...images.filter((i) => i !== url)]);
  }

  return (
    <div className="rounded-2xl border border-sandalwood-light bg-ivory p-5">
      <h3 className="mb-1 font-serif text-base text-maroon-900">Photos</h3>
      <p className="mb-4 text-xs text-brown-700/55">
        First photo is the one shown on cards and listings.
      </p>

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div
              key={url}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-lg border bg-cream",
                i === 0 ? "border-maroon-600" : "border-sandalwood-light"
              )}
            >
              <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-maroon-600 px-1.5 py-0.5 text-[9px] font-semibold text-ivory">
                  Main
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-brown-700/70 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(url)}
                    title="Make main photo"
                    aria-label="Make main photo"
                    className="grid h-6 w-6 place-items-center rounded text-ivory hover:bg-ivory/20"
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  title="Remove photo"
                  aria-label="Remove photo"
                  className="grid h-6 w-6 place-items-center rounded text-ivory hover:bg-ivory/20"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-sandalwood-light px-4 py-7 text-center transition-colors hover:border-maroon-600 hover:bg-cream",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 size={20} className="animate-spin text-maroon-600" />
        ) : (
          <ImagePlus size={20} className="text-maroon-600" />
        )}
        <span className="text-sm font-medium text-maroon-900">
          {uploading ? "Uploading…" : "Upload photos"}
        </span>
        <span className="text-xs text-brown-700/55">JPG, PNG, WebP or AVIF · up to 5MB each</span>
      </label>

      {error && (
        <p className="mt-3 rounded-lg bg-temple-red/10 px-3 py-2 text-xs text-temple-red">{error}</p>
      )}
    </div>
  );
}
