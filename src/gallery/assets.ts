import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { Portrait } from './types'
import {
  createFloorTexture,
  createLabelTexture,
  createPortraitDataURL,
  createPortraitTexture,
  createTitleTexture,
} from './textures'

/**
 * Asset caching for the gallery.
 *
 * Everything here lives at module scope, so caches survive component
 * unmounts and scene revisits: re-entering the gallery reuses the same
 * GPU textures, decoded images, and GLTF models instead of recreating or
 * re-downloading them. Resources in these caches are intentionally NEVER
 * disposed by components — they are bounded (one entry per distinct
 * asset) and reused for the lifetime of the page.
 *
 * For GLB/GLTF models, drei's `useGLTF` already provides a URL-keyed
 * cache shared across every component instance; `preloadGalleryAssets()`
 * below warms it. No custom model-loading system is needed.
 */

// three's image cache: TextureLoader/ImageLoader reuse already-fetched
// images instead of hitting the network again.
THREE.Cache.enabled = true

/** Canvas-generated textures: created once per key, shared everywhere. */
const canvasTextures = new Map<string, THREE.Texture>()
/** Portrait image loads: one in-flight/resolved promise per URL. */
const imageTextures = new Map<string, Promise<THREE.Texture | null>>()
/** Placeholder data-URL previews for the HTML information panel. */
const portraitDataURLs = new Map<string, string>()

function cachedTexture(key: string, create: () => THREE.Texture): THREE.Texture {
  let texture = canvasTextures.get(key)
  if (!texture) {
    texture = create()
    canvasTextures.set(key, texture)
  }
  return texture
}

/* ------------------------------------------------------------
   Canvas-generated textures (floor, plaques, labels, portraits)
   ------------------------------------------------------------ */

export function getCachedFloorTexture(): THREE.Texture {
  return cachedTexture('floor', () => {
    const texture = createFloorTexture()
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 12)
    return texture
  })
}

export function getCachedTitleTexture(): THREE.Texture {
  return cachedTexture('title', createTitleTexture)
}

export function getCachedPlaqueTexture(portrait: Portrait): THREE.Texture {
  return cachedTexture(`plaque:${portrait.id}`, () => createPortraitTexture(portrait))
}

export function getCachedPortraitTexture(portrait: Portrait): THREE.Texture {
  return cachedTexture(`portrait:${portrait.id}`, () => createPortraitTexture(portrait))
}

export function getCachedLabelTexture(portrait: Portrait): THREE.Texture {
  return cachedTexture(`label:${portrait.id}`, () => createLabelTexture(portrait))
}

/** Data-URL preview of the generated placeholder, cached per portrait. */
export function getCachedPortraitDataURL(portrait: Portrait): string {
  const key = `dataurl:${portrait.id}`
  let dataURL = portraitDataURLs.get(key)
  if (!dataURL) {
    dataURL = createPortraitDataURL(portrait)
    portraitDataURLs.set(key, dataURL)
  }
  return dataURL
}

/* ------------------------------------------------------------
   Portrait photographs (imagePath)
   ------------------------------------------------------------ */

/**
 * Load a portrait image once per URL. Later callers (other frames, or a
 * revisit of the gallery) await the same promise and receive the same
 * texture — no second download, no duplicate GPU upload.
 * Resolves to `null` when the image is missing so callers keep the
 * generated placeholder.
 */
export function loadImageTexture(url: string): Promise<THREE.Texture | null> {
  let pending = imageTextures.get(url)
  if (!pending) {
    pending = new Promise<THREE.Texture | null>((resolve) => {
      new THREE.TextureLoader().load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          resolve(texture)
        },
        undefined,
        () => resolve(null),
      )
    })
    imageTextures.set(url, pending)
  }
  return pending
}

/* ------------------------------------------------------------
   GLB/GLTF models (drei cache + preload)
   ------------------------------------------------------------ */

/**
 * Model URLs to fetch ahead of time. drei's `useGLTF` caches loaded
 * models by URL for the whole page session, so a model is downloaded at
 * most once no matter how often scenes remount. Add paths here, e.g.:
 *
 *   const MODELS = ['/models/bust.glb']
 */
const MODELS: string[] = []

/** Warm the shared model cache as soon as the gallery module loads. */
export function preloadGalleryAssets(): void {
  for (const url of MODELS) useGLTF.preload(url)
}

preloadGalleryAssets()
