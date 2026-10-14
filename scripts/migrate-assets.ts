import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load .env.local then .env
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local", override: true });
}
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UPLOAD_URL = process.env.ASSETS_UPLOAD_URL || "https://assets.najmifaza.my.id/";
const TOKEN = process.env.ASSETS_BEARER_TOKEN;

if (!TOKEN) {
  console.error("Error: ASSETS_BEARER_TOKEN is not defined in environment variables (.env.local)");
  process.exit(1);
}

const MAP_FILE = path.join(process.cwd(), "scripts", "cdn-assets-map.json");

interface AssetMap {
  categories: {
    avatar: Record<string, string>;
    licenses: Record<string, string>;
    projects: Record<string, string>;
    og: Record<string, string>;
    misc: Record<string, string>;
  };
  flat: Record<string, string>;
}

function loadMap(): AssetMap {
  if (fs.existsSync(MAP_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MAP_FILE, "utf-8"));
    } catch {
      // ignore
    }
  }
  return {
    categories: {
      avatar: {},
      licenses: {},
      projects: {},
      og: {},
      misc: {},
    },
    flat: {},
  };
}

function saveMap(map: AssetMap) {
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2), "utf-8");
}

async function uploadFile(filePath: string, filename: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer]);
  const formData = new FormData();
  formData.append("file", blob, filename);

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed (${res.status}): ${errText}`);
  }

  const json = (await res.json()) as { status: string; url?: string; message?: string };
  if (json.status !== "success" || !json.url) {
    throw new Error(`Upload error response: ${json.message || JSON.stringify(json)}`);
  }

  return json.url;
}

function getCategory(relPath: string): keyof AssetMap["categories"] {
  const normalized = relPath.replace(/\\/g, "/");
  if (normalized.includes("/licenses/")) return "licenses";
  if (normalized.includes("/projects/")) return "projects";
  if (normalized.includes("/og/")) return "og";
  if (normalized.includes("avatar")) return "avatar";
  return "misc";
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function run() {
  console.log("=== Phase 1: Uploading assets to assets.najmifaza.my.id ===");
  const imagesDir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imagesDir)) {
    console.error("public/images directory not found!");
    return;
  }

  const files = getAllFiles(imagesDir);
  console.log(`Found ${files.length} media files in public/images`);

  const assetMap = loadMap();
  let uploadedCount = 0;
  let cachedCount = 0;

  for (const filePath of files) {
    const relFromPublic = "/" + path.relative(path.join(process.cwd(), "public"), filePath).replace(/\\/g, "/");
    const filename = path.basename(filePath);
    const category = getCategory(relFromPublic);

    if (assetMap.flat[relFromPublic]) {
      cachedCount++;
      continue;
    }

    try {
      console.log(`Uploading [${category}] ${filename}...`);
      const cdnUrl = await uploadFile(filePath, filename);
      assetMap.categories[category][relFromPublic] = cdnUrl;
      assetMap.flat[relFromPublic] = cdnUrl;
      uploadedCount++;
      saveMap(assetMap);
      console.log(` -> OK: ${cdnUrl}`);
    } catch (err) {
      console.error(` -> Failed to upload ${relFromPublic}:`, err);
    }
  }

  console.log(`Asset upload complete. Uploaded: ${uploadedCount}, Cached/Skipped: ${cachedCount}`);
  saveMap(assetMap);

  console.log("\n=== Phase 2: Updating Database Records ===");
  const flat = assetMap.flat;

  // 1. Profile avatar
  const profiles = await prisma.profile.findMany();
  for (const p of profiles) {
    if (flat[p.avatar]) {
      const newAvatar = flat[p.avatar];
      await prisma.profile.update({
        where: { id: p.id },
        data: { avatar: newAvatar },
      });
      console.log(`Updated Profile avatar -> ${newAvatar}`);
    }
  }

  // 2. Certificates
  const certs = await prisma.certificate.findMany();
  for (const c of certs) {
    if (flat[c.image]) {
      const newImg = flat[c.image];
      await prisma.certificate.update({
        where: { id: c.id },
        data: { image: newImg },
      });
      console.log(`Updated Certificate [${c.title}] -> ${newImg}`);
    }
  }

  // 3. Experiences
  const exps = await prisma.experience.findMany();
  for (const exp of exps) {
    if (exp.images && Array.isArray(exp.images)) {
      let modified = false;
      const updatedImages = exp.images.map((img: any) => {
        if (img && typeof img === "object" && img.src && flat[img.src]) {
          modified = true;
          return { ...img, src: flat[img.src] };
        }
        return img;
      });

      if (modified) {
        await prisma.experience.update({
          where: { id: exp.id },
          data: { images: updatedImages },
        });
        console.log(`Updated Experience [${exp.company}] images to CDN`);
      }
    }
  }

  // 4. Projects
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    if (proj.images && Array.isArray(proj.images)) {
      let modified = false;
      const updatedImages = proj.images.map((imgStr: any) => {
        if (typeof imgStr === "string" && flat[imgStr]) {
          modified = true;
          return flat[imgStr];
        }
        return imgStr;
      });

      if (modified) {
        await prisma.project.update({
          where: { id: proj.id },
          data: { images: updatedImages },
        });
        console.log(`Updated Project [${proj.slug}] cover/images to CDN`);
      }
    }
  }

  // 5. Project Translations content markdown
  const projectTranslations = await prisma.projectTranslation.findMany();
  for (const pt of projectTranslations) {
    let content = pt.content;
    let modified = false;

    for (const [localPath, cdnUrl] of Object.entries(flat)) {
      if (content.includes(localPath)) {
        content = content.split(localPath).join(cdnUrl);
        modified = true;
      }
    }

    if (modified) {
      await prisma.projectTranslation.update({
        where: { id: pt.id },
        data: { content },
      });
      console.log(`Updated ProjectTranslation [${pt.projectId} - ${pt.locale}] markdown links`);
    }
  }

  console.log("\nDatabase migration completed successfully!");
}

run()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
