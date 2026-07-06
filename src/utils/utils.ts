import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cookies } from "next/headers";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

import { notFound } from "next/navigation";

function getMDXFiles(dir: string, locale?: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  const allFiles = fs.readdirSync(dir);

  if (locale) {
    // With locale: look for .{locale}.mdx files first, fall back to plain .mdx
    const localeSuffix = `.${locale}.mdx`;
    const localeFiles = allFiles.filter((file) => file.endsWith(localeSuffix));

    if (localeFiles.length > 0) {
      return localeFiles;
    }
  }

  // Default: return plain .mdx files (files that do NOT have a locale suffix like .id.mdx or .en.mdx)
  return allFiles.filter((file) => {
    if (path.extname(file) !== ".mdx") return false;
    const basename = file.slice(0, -4); // remove .mdx
    return !basename.endsWith(".id") && !basename.endsWith(".en");
  });
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    subtitle: data.subtitle || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string, locale?: string) {
  const mdxFiles = getMDXFiles(dir, locale);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));

    // Strip locale suffix from slug: "my-post.en.mdx" → "my-post"
    let slug = path.basename(file, path.extname(file));
    if (slug.endsWith(".id") || slug.endsWith(".en")) {
      slug = slug.slice(0, -3); // remove ".id" or ".en"
    }

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""], locale?: string) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir, locale);
}

export async function getPostsForCurrentLocale(customPath = ["", "", "", ""]) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "id";
  return getPosts(customPath, locale);
}
