"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { FacebookIcon } from "@/components/icons/SocialIcons";
import { cn } from "@/lib/utils";

/**
 * Share control tuned for an Indian storefront: WhatsApp first, since that's
 * where gifting decisions actually get made.
 *
 * On mobile the OS share sheet is used when available — one tap, and it
 * already contains WhatsApp plus everything else the user has installed.
 * Desktop browsers mostly lack navigator.share, so they get an explicit menu.
 */
export function ShareButton({
  url,
  title,
  text,
  label,
  variant = "icon",
  className,
}: {
  /** Path or absolute URL. Relative paths resolve against the current origin. */
  url: string;
  title: string;
  /** Message prefix used for WhatsApp, where the link is pasted inline. */
  text?: string;
  label?: string;
  variant?: "icon" | "button";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function absolute() {
    if (typeof window === "undefined") return url;
    return new URL(url, window.location.origin).toString();
  }

  async function handleClick() {
    // Checked at click time rather than on mount: navigator.share only exists
    // in the browser (and only over HTTPS or localhost), and reading it here
    // keeps server and client markup identical with no state to sync.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url: absolute() });
        return;
      } catch {
        // Sheet dismissed, or the browser refused — fall through to the menu
        // rather than leaving the user with nothing.
      }
    }
    setOpen((v) => !v);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(absolute());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
    setOpen(false);
  }

  const shareUrl = typeof window === "undefined" ? url : absolute();
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `${text ?? title}\n${shareUrl}`
  )}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label ?? "Share"}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          variant === "icon"
            ? "grid h-11 w-11 place-items-center rounded-full border border-sandalwood-light text-maroon-600 transition-colors hover:border-maroon-600 hover:bg-cream"
            : "flex items-center gap-2 rounded-full border border-sandalwood-light px-4 py-2.5 text-sm font-medium text-maroon-700 transition-colors hover:border-maroon-600 hover:bg-cream"
        )}
      >
        {copied ? <Check size={17} className="text-green-700" /> : <Share2 size={17} />}
        {variant === "button" && <span>{copied ? "Link copied" : (label ?? "Share")}</span>}
      </button>

      {/* Only ever opens when the native sheet was unavailable or dismissed. */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-sandalwood-light bg-ivory py-1 shadow-lift"
        >
          <a
            role="menuitem"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brown-700/85 hover:bg-cream hover:text-maroon-600"
          >
            <WhatsAppGlyph /> WhatsApp
          </a>
          <a
            role="menuitem"
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brown-700/85 hover:bg-cream hover:text-maroon-600"
          >
            <FacebookIcon width={16} height={16} /> Facebook
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={copy}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-brown-700/85 hover:bg-cream hover:text-maroon-600"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}

/** Inline so the menu doesn't depend on an icon set that lacks a WhatsApp mark. */
function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
