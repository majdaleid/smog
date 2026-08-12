import { deflateSync } from 'zlib'
import { nativeImage } from 'electron'

/**
 * Minimal dependency-free PNG encoder (8-bit RGBA) so the tray icon does not
 * rely on any external asset file. Produces a small colored "smog" dot.
 */

function crc32(buf: Buffer): number {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
    }
  }
  return ~c >>> 0
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePng(width: number, height: number, rgba: Buffer): Buffer {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ])
}

/** A filled accent-colored circle with a soft edge, on a transparent canvas. */
export function createTrayIcon(size = 16): Electron.NativeImage {
  const rgba = Buffer.alloc(size * size * 4)
  const cx = (size - 1) / 2
  const cy = (size - 1) / 2
  const r = size / 2 - 0.5
  // accent #7c93ee
  const R = 0x7c
  const G = 0x93
  const B = 0xee
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const i = (y * size + x) * 4
      let alpha = 0
      if (dist <= r - 1) alpha = 255
      else if (dist <= r) alpha = Math.max(0, Math.round(255 * (r - dist)))
      rgba[i] = R
      rgba[i + 1] = G
      rgba[i + 2] = B
      rgba[i + 3] = alpha
    }
  }
  const png = encodePng(size, size, rgba)
  return nativeImage.createFromBuffer(png, { scaleFactor: 1.0 })
}
