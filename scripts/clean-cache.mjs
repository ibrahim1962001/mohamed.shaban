/** Remove Next.js cache — fixes stale CSS / 500 errors in dev mode. */
import fs from "fs";
import path from "path";

const nextDir = path.join(process.cwd(), ".next");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("✓ Cleared .next cache");
} else {
  console.log("✓ No cache to clear");
}
