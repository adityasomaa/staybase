"use client";

import * as React from "react";
import Script from "next/script";
import { Languages } from "lucide-react";

import { SOURCE_LANGUAGE, languages } from "@/lib/i18n/languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Page translation, via Google's website translator.
 *
 * The switcher writes the `googtrans` cookie and reloads rather than driving
 * the widget's own hidden <select>: the cookie is what the widget reads on
 * load, so the choice survives navigation and a refresh, and we never have to
 * reach into their DOM. Their banner is hidden — the switcher below is the
 * control — but the widget itself has to be mounted for any of it to work.
 *
 * One caveat worth knowing: the translator rewrites text nodes in place, which
 * is the one thing React also claims ownership of. Machine translation of a
 * live app is best-effort, not a substitute for real localisation.
 */
const COOKIE = "googtrans";

function readCookie(): string {
  if (typeof document === "undefined") return SOURCE_LANGUAGE;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.split("=")[1];
  if (!raw) return SOURCE_LANGUAGE;
  const parts = decodeURIComponent(raw).split("/");
  return parts[2] || SOURCE_LANGUAGE;
}

function writeCookie(code: string) {
  const value = `/${SOURCE_LANGUAGE}/${code}`;
  const bare = window.location.hostname;
  // Written for the host and for the registrable domain, because the widget
  // looks for both and localhost accepts neither with a leading dot.
  document.cookie = `${COOKIE}=${value};path=/;max-age=31536000`;
  document.cookie = `${COOKIE}=${value};domain=${bare};path=/;max-age=31536000`;
  document.cookie = `${COOKIE}=${value};domain=.${bare};path=/;max-age=31536000`;
}

function clearCookie() {
  const bare = window.location.hostname;
  for (const domain of ["", `;domain=${bare}`, `;domain=.${bare}`]) {
    document.cookie = `${COOKIE}=;path=/${domain};max-age=0`;
  }
}

/** The cookie never changes without a reload, so there is nothing to watch. */
const subscribe = () => () => {};

export function LanguageSwitcher() {
  // The cookie is an external store: read through useSyncExternalStore so the
  // server renders English and the client corrects it without an effect that
  // sets state on mount.
  const value = React.useSyncExternalStore(subscribe, readCookie, () => SOURCE_LANGUAGE);

  const choose = (code: string) => {
    if (code === SOURCE_LANGUAGE) clearCookie();
    else writeCookie(code);
    window.location.reload();
  };

  return (
    <>
      <Script id="google-translate-init" strategy="afterInteractive">
        {`window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement(
              { pageLanguage: "${SOURCE_LANGUAGE}", autoDisplay: false },
              "google_translate_element"
            );
          };`}
      </Script>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      <Select value={value} onValueChange={choose}>
        <SelectTrigger
          size="sm"
          className="notranslate h-8 w-auto gap-1.5 px-2"
          aria-label="Language"
        >
          <Languages className="size-4 shrink-0 opacity-70" />
          <span className="hidden sm:inline">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent className="notranslate max-h-80">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
