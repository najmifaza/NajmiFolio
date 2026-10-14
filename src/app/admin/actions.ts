"use server";

import { prisma } from "@/lib/prisma";
import { autoTranslate } from "@/services/translatorService";
import { uploadAsset } from "@/lib/assetsUploader";
import { invalidateContentCache } from "@/services/contentService";
import { invalidateProjectCache } from "@/services/projectService";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. Auth check helper
export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value === "authenticated";
}

// 2. Translate text helper action
export async function translateAction(
  text: string,
  from: string = "id",
  to: string = "en"
): Promise<{ success: boolean; result: string }> {
  try {
    const res = await autoTranslate(text, from, to);
    return { success: true, result: res };
  } catch (err: any) {
    return { success: false, result: text };
  }
}

// 3. Media Upload Action (uploads directly to assets.najmifaza.my.id CDN)
export async function uploadMediaAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  if (!(await verifyAuth())) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const res = await uploadAsset(file, file.name);
  return res;
}

// 4. Project CRUD
export interface SaveProjectInput {
  id?: string;
  slug: string;
  link?: string;
  github?: string;
  featured?: boolean;
  order?: number;
  images: string[];
  idTitle: string;
  idSummary: string;
  idContent: string;
  enTitle?: string;
  enSummary?: string;
  enContent?: string;
  autoTranslateEn?: boolean;
}

export async function saveProjectAction(data: SaveProjectInput) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  let enTitle = data.enTitle || "";
  let enSummary = data.enSummary || "";
  let enContent = data.enContent || "";

  if (data.autoTranslateEn || !enTitle) {
    enTitle = await autoTranslate(data.idTitle, "id", "en");
    enSummary = await autoTranslate(data.idSummary, "id", "en");
    if (!enContent && data.idContent) {
      enContent = await autoTranslate(data.idContent, "id", "en");
    }
  }

  let project;
  if (data.id) {
    project = await prisma.project.update({
      where: { id: data.id },
      data: {
        slug: data.slug,
        link: data.link || null,
        github: data.github || null,
        featured: data.featured || false,
        order: data.order ?? 0,
        images: data.images,
      },
    });
  } else {
    project = await prisma.project.create({
      data: {
        slug: data.slug,
        link: data.link || null,
        github: data.github || null,
        featured: data.featured || false,
        order: data.order ?? 0,
        images: data.images,
        publishedAt: new Date(),
      },
    });
  }

  // Save Indonesian translation
  await prisma.projectTranslation.upsert({
    where: {
      projectId_locale: { projectId: project.id, locale: "id" },
    },
    update: {
      title: data.idTitle,
      summary: data.idSummary,
      content: data.idContent,
    },
    create: {
      projectId: project.id,
      locale: "id",
      title: data.idTitle,
      summary: data.idSummary,
      content: data.idContent,
    },
  });

  // Save English translation
  await prisma.projectTranslation.upsert({
    where: {
      projectId_locale: { projectId: project.id, locale: "en" },
    },
    update: {
      title: enTitle || data.idTitle,
      summary: enSummary || data.idSummary,
      content: enContent || data.idContent,
    },
    create: {
      projectId: project.id,
      locale: "en",
      title: enTitle || data.idTitle,
      summary: enSummary || data.idSummary,
      content: enContent || data.idContent,
    },
  });

  invalidateProjectCache();

  revalidatePath("/");
  revalidatePath("/project");
  revalidatePath(`/project/${project.slug}`);
  revalidatePath("/en");
  revalidatePath("/en/project");
  revalidatePath(`/en/project/${project.slug}`);

  return { success: true, project };
}

export async function deleteProjectAction(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");
  await prisma.project.delete({ where: { id } });

  invalidateProjectCache();

  revalidatePath("/");
  revalidatePath("/project");
  revalidatePath("/en");
  revalidatePath("/en/project");
  return { success: true };
}

// 5. Profile & Translations CRUD
export interface SaveProfileInput {
  avatar: string;
  email: string;
  location: string;
  languages: string[];
  idName: string;
  idRole: string;
  idHeadline: string;
  idSubline: string;
  idIntro: string;
  enName?: string;
  enRole?: string;
  enHeadline?: string;
  enSubline?: string;
  enIntro?: string;
  autoTranslateEn?: boolean;
}

export async function saveProfileAction(data: SaveProfileInput) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  let enName = data.enName || data.idName;
  let enRole = data.enRole || data.idRole;
  let enHeadline = data.enHeadline || "";
  let enSubline = data.enSubline || "";
  let enIntro = data.enIntro || "";

  if (data.autoTranslateEn || !enHeadline) {
    enRole = await autoTranslate(data.idRole, "id", "en");
    enHeadline = await autoTranslate(data.idHeadline, "id", "en");
    enSubline = await autoTranslate(data.idSubline, "id", "en");
    enIntro = await autoTranslate(data.idIntro, "id", "en");
  }

  const profile = await prisma.profile.upsert({
    where: { id: "default" },
    update: {
      avatar: data.avatar,
      email: data.email,
      location: data.location,
      languages: data.languages,
    },
    create: {
      id: "default",
      avatar: data.avatar,
      email: data.email,
      location: data.location,
      languages: data.languages,
    },
  });

  await prisma.profileTranslation.upsert({
    where: { profileId_locale: { profileId: profile.id, locale: "id" } },
    update: {
      name: data.idName,
      role: data.idRole,
      headline: data.idHeadline,
      subline: data.idSubline,
      intro: data.idIntro,
    },
    create: {
      profileId: profile.id,
      locale: "id",
      name: data.idName,
      role: data.idRole,
      headline: data.idHeadline,
      subline: data.idSubline,
      intro: data.idIntro,
    },
  });

  await prisma.profileTranslation.upsert({
    where: { profileId_locale: { profileId: profile.id, locale: "en" } },
    update: {
      name: enName,
      role: enRole,
      headline: enHeadline,
      subline: enSubline,
      intro: enIntro,
    },
    create: {
      profileId: profile.id,
      locale: "en",
      name: enName,
      role: enRole,
      headline: enHeadline,
      subline: enSubline,
      intro: enIntro,
    },
  });

  invalidateContentCache();

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/en");
  revalidatePath("/en/about");
  return { success: true };
}

// 6. Experience CRUD
export interface SaveExperienceInput {
  id?: string;
  company: string;
  timeframe: string;
  order: number;
  images?: any;
  idRole: string;
  idAchievements: string[];
  enRole?: string;
  enAchievements?: string[];
  autoTranslateEn?: boolean;
}

export async function saveExperienceAction(data: SaveExperienceInput) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  let enRole = data.enRole || data.idRole;
  let enAchievements = data.enAchievements || [];

  if (data.autoTranslateEn || enAchievements.length === 0) {
    enRole = await autoTranslate(data.idRole, "id", "en");
    enAchievements = await Promise.all(
      data.idAchievements.map((item) => autoTranslate(item, "id", "en"))
    );
  }

  let expId = data.id;
  if (expId) {
    await prisma.experience.update({
      where: { id: expId },
      data: {
        company: data.company,
        timeframe: data.timeframe,
        order: data.order,
        images: data.images || null,
      },
    });
  } else {
    const created = await prisma.experience.create({
      data: {
        profileId: "default",
        company: data.company,
        timeframe: data.timeframe,
        order: data.order,
        images: data.images || null,
      },
    });
    expId = created.id;
  }

  await prisma.experienceTranslation.upsert({
    where: { experienceId_locale: { experienceId: expId, locale: "id" } },
    update: { role: data.idRole, achievements: data.idAchievements },
    create: { experienceId: expId, locale: "id", role: data.idRole, achievements: data.idAchievements },
  });

  await prisma.experienceTranslation.upsert({
    where: { experienceId_locale: { experienceId: expId, locale: "en" } },
    update: { role: enRole, achievements: enAchievements },
    create: { experienceId: expId, locale: "en", role: enRole, achievements: enAchievements },
  });

  invalidateContentCache();

  revalidatePath("/about");
  revalidatePath("/en/about");
  return { success: true };
}

export async function deleteExperienceAction(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");
  await prisma.experience.delete({ where: { id } });

  invalidateContentCache();

  revalidatePath("/about");
  revalidatePath("/en/about");
  return { success: true };
}

// 7. Certificate CRUD
export interface SaveCertificateInput {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  url?: string;
  order?: number;
}

export async function saveCertificateAction(data: SaveCertificateInput) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  if (data.id) {
    await prisma.certificate.update({
      where: { id: data.id },
      data: {
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        image: data.image,
        url: data.url || null,
        order: data.order ?? 0,
      },
    });
  } else {
    await prisma.certificate.create({
      data: {
        profileId: "default",
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        image: data.image,
        url: data.url || null,
        order: data.order ?? 0,
      },
    });
  }

  invalidateContentCache();

  revalidatePath("/licenses");
  revalidatePath("/en/licenses");
  return { success: true };
}

export async function deleteCertificateAction(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");
  await prisma.certificate.delete({ where: { id } });

  invalidateContentCache();

  revalidatePath("/licenses");
  revalidatePath("/en/licenses");
  return { success: true };
}
