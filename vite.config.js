import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { projectPhotosPlugin } from './scripts/project-photos.mjs'
import { seoPlugin } from './scripts/seo.mjs'
import { securityHeadersPlugin, siteHeaders } from './scripts/security-headers.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), projectPhotosPlugin(), seoPlugin(), securityHeadersPlugin()],
  // `npm run preview` (and so `npm test`) sends the live site's security
  // headers from public/_headers. Not in `npm run dev`, whose hot reload
  // needs scripts the policy would block.
  preview: {
    headers: siteHeaders(import.meta.dirname),
  },
  build: {
    // never publish source maps: they would hand out the original source
    sourcemap: false,
  },
})
