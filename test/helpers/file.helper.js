import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

/**
 * Creates a minimal valid empty ZIP file in a temp directory.
 * The file contains only an End of Central Directory (EOCD) record —
 * the smallest byte sequence that passes ZIP magic-byte validation.
 * The server will reject it as an invalid shapefile (no .shp content),
 * which lets us test the error path of the benefit area upload.
 *
 * @returns {string} Absolute path to the created file
 */
export function createMinimalZip(filename = 'test-benefit-area.zip') {
  // End of Central Directory record (22 bytes) — valid empty ZIP
  const eocd = Buffer.from([
    0x50, 0x4B, 0x05, 0x06, // EOCD signature: PK\x05\x06
    0x00, 0x00,             // Disk number
    0x00, 0x00,             // Start disk of central directory
    0x00, 0x00,             // Entries on this disk
    0x00, 0x00,             // Total entries
    0x00, 0x00, 0x00, 0x00, // Central directory size
    0x00, 0x00, 0x00, 0x00, // Central directory offset
    0x00, 0x00              // Comment length
  ])
  const dir = join(tmpdir(), 'pafs-journey-tests')
  mkdirSync(dir, { recursive: true })
  const filePath = join(dir, filename)
  writeFileSync(filePath, eocd)
  return filePath
}

/**
 * Creates a fake non-ZIP file for testing file-type validation.
 * @returns {string} Absolute path to the created file
 */
export function createNonZipFile(filename = 'test-not-a-zip.txt') {
  const dir = join(tmpdir(), 'pafs-journey-tests')
  mkdirSync(dir, { recursive: true })
  const filePath = join(dir, filename)
  writeFileSync(filePath, 'This is a plain text file, not a shapefile.')
  return filePath
}
