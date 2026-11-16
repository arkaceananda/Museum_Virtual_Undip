import { GalleryScene } from './gallery'

/**
 * Museum Virtual Undip — application shell.
 * The interactive 3D portrait gallery corridor is implemented as a
 * self-contained feature under `src/gallery/` so it can later be embedded
 * in a larger virtual museum (2D map + multiple exhibition locations).
 */
function App() {
  return <GalleryScene />
}

export default App
