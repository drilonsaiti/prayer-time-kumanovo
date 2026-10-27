import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// After the build: list every file of the app inside dist/sw.js so the service
// worker can save all of it for offline use, and give it a version that changes
// whenever any file changes (that is how visitors get the "Version i ri" prompt).
function offlinePrecache() {
  let outDir = 'dist'
  return {
    name: 'takvim-offline-precache',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const swPath = path.join(outDir, 'sw.js')
      if (!fs.existsSync(swPath)) return
      const files = []
      const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) walk(full)
          else files.push(full)
        }
      }
      walk(outDir)
      const relevant = files
        .filter((f) => path.basename(f) !== 'sw.js' && !f.endsWith('.map'))
        .sort()
      const urls = relevant.map((f) => '/' + path.relative(outDir, f).split(path.sep).join('/'))
      const hash = crypto.createHash('sha1')
      for (const f of relevant) hash.update(f).update(fs.readFileSync(f))
      const version = hash.digest('hex').slice(0, 10)
      const sw = fs
        .readFileSync(swPath, 'utf8')
        .replace('__VERSION__', version)
        .replace('/*__PRECACHE__*/[]', JSON.stringify(urls, null, 2))
      fs.writeFileSync(swPath, sw)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), offlinePrecache()],
})
