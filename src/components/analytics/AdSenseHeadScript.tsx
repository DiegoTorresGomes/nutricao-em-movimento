"use client";

import { ADSENSE_CLIENT } from "@/config/monetization";

const noop = () => {};

/**
 * Native AdSense tag rendered in place inside <head>.
 * React 19 hoists `<script async src>` ahead of all other head children; an onLoad
 * handler opts out of that hoisting, so this tag stays after the consent defaults.
 */
export function AdSenseHeadScript() {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      onLoad={noop}
    />
  );
}
