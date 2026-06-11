import sharp from "sharp";
import { readdir } from "fs/promises";
import path from "path";

const dir = path.join(process.cwd(), "public", "products");
const files = (await readdir(dir)).filter((f) => /^\d+\.png$/i.test(f));

for (const file of files) {
  const filePath = path.join(dir, file);
  const img = sharp(filePath);
  const meta = await img.metadata();
  const cropBottom = Math.round(meta.height * 0.18);
  const cropTop = Math.round(meta.height * 0.02);
  const height = meta.height - cropBottom - cropTop;

  await img
    .extract({
      left: 0,
      top: cropTop,
      width: meta.width,
      height,
    })
    .toFile(filePath + ".tmp");

  await sharp(filePath + ".tmp").toFile(filePath);
  const { unlink } = await import("fs/promises");
  await unlink(filePath + ".tmp");

  console.log(`✓ ${file}: ${meta.width}x${meta.height} → ${meta.width}x${height}`);
}
