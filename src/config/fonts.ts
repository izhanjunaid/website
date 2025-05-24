import { Playfair_Display } from "next/font/google";

// Configure Playfair Display font with fallback
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  preload: true,
  adjustFontFallback: true
});

// Add other fonts here as needed 