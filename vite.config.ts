import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

/**
 * HTTP caching for static assets:
 * - `/assets/*` holds Vite's fingerprinted bundles → cache forever.
 * - Public assets (portrait images, GLB models, icons) are not
 *   fingerprinted → cache briefly so updates still propagate.
 * - Transformed sources keep Vite's default revalidation (`no-cache`),
 *   which is what keeps dev fresh without bypassing the browser cache
 *   for real assets.
 */
function staticAssetCacheHeaders(): Plugin {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ?? ''
    if (url.startsWith('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    } else if (/\.(?:glb|gltf|hdr|png|jpe?g|webp|avif|svg|woff2?)(?:\?|$)/.test(url)) {
      res.setHeader('Cache-Control', 'public, max-age=3600')
    }
    next()
  }

  return {
    name: 'static-asset-cache-headers',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticAssetCacheHeaders()],
})
