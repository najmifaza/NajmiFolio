"use server";

import { uploadAsset } from "@/lib/assetsUploader";
import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invalidateContentCache } from "@/services/contentService";
import { invalidateProjectCache } from "@/services/projectService";
import { autoTranslate } from "@/services/translatorService";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// 1. Auth check helper
export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return verifyAuthToken(token);
}

// 2. Translate text helper action
export async function translateAction(
  text: string,
  from = "id",
  to = "en",
): Promise<{ success: boolean; result: string }> {
  try {
    const res = await autoTranslate(text, from, to);
    return { success: true, result: res };
  } catch (_err) {
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

  const savedProject = await prisma.$transaction(async (tx) => {
    let p: { id: string; slug: string };
    if (data.id) {
      p = await tx.project.update({
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
      p = await tx.project.create({
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
    await tx.projectTranslation.upsert({
      where: {
        projectId_locale: { projectId: p.id, locale: "id" },
      },
      update: {
        title: data.idTitle,
        summary: data.idSummary,
        content: data.idContent,
      },
      create: {
        projectId: p.id,
        locale: "id",
        title: data.idTitle,
        summary: data.idSummary,
        content: data.idContent,
      },
    });

    // Save English translation
    await tx.projectTranslation.upsert({
      where: {
        projectId_locale: { projectId: p.id, locale: "en" },
      },
      update: {
        title: enTitle || data.idTitle,
        summary: enSummary || data.idSummary,
        content: enContent || data.idContent,
      },
      create: {
        projectId: p.id,
        locale: "en",
        title: enTitle || data.idTitle,
        summary: enSummary || data.idSummary,
        content: enContent || data.idContent,
      },
    });

    return p;
  });

  invalidateProjectCache();

  revalidatePath("/");
  revalidatePath("/project");
  revalidatePath(`/project/${savedProject.slug}`);
  revalidatePath("/en");
  revalidatePath("/en/project");
  revalidatePath(`/en/project/${savedProject.slug}`);

  return { success: true, project: savedProject };
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

  const enName = data.enName || data.idName;
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

  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
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

    await tx.profileTranslation.upsert({
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

    await tx.profileTranslation.upsert({
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
  images?: unknown;
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
      data.idAchievements.map((item) => autoTranslate(item, "id", "en")),
    );
  }

  await prisma.$transaction(async (tx) => {
    let expId = data.id;
    if (expId) {
      await tx.experience.update({
        where: { id: expId },
        data: {
          company: data.company,
          timeframe: data.timeframe,
          order: data.order,
          images: data.images ? (data.images as Prisma.InputJsonValue) : undefined,
        },
      });
    } else {
      const created = await tx.experience.create({
        data: {
          profileId: "default",
          company: data.company,
          timeframe: data.timeframe,
          order: data.order,
          images: data.images ? (data.images as Prisma.InputJsonValue) : undefined,
        },
      });
      expId = created.id;
    }

    await tx.experienceTranslation.upsert({
      where: { experienceId_locale: { experienceId: expId, locale: "id" } },
      update: { role: data.idRole, achievements: data.idAchievements },
      create: {
        experienceId: expId,
        locale: "id",
        role: data.idRole,
        achievements: data.idAchievements,
      },
    });

    await tx.experienceTranslation.upsert({
      where: { experienceId_locale: { experienceId: expId, locale: "en" } },
      update: { role: enRole, achievements: enAchievements },
      create: { experienceId: expId, locale: "en", role: enRole, achievements: enAchievements },
    });
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

// 8. Social Links CRUD
export interface SocialLinkItem {
  id?: string;
  name: string;
  icon: string;
  link: string;
  essential: boolean;
  order: number;
}

export async function saveSocialLinksAction(links: SocialLinkItem[]) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    // Delete existing social links for profile default and recreate or replace
    await tx.socialLink.deleteMany({ where: { profileId: "default" } });
    if (links.length > 0) {
      await tx.socialLink.createMany({
        data: links.map((item, idx) => ({
          profileId: "default",
          name: item.name,
          icon: item.icon || "globe",
          link: item.link,
          essential: item.essential ?? true,
          order: item.order ?? idx,
        })),
      });
    }
  });

  invalidateContentCache();
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/en");
  revalidatePath("/en/about");
  return { success: true };
}

// 9. Studies CRUD
export interface SaveStudyInput {
  id?: string;
  institution: string;
  timeframe: string;
  order: number;
  images?: unknown;
  idDegree: string;
  idDescription: string;
  enDegree?: string;
  enDescription?: string;
  autoTranslateEn?: boolean;
}

export async function saveStudyAction(data: SaveStudyInput) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  let enDegree = data.enDegree || data.idDegree;
  let enDescription = data.enDescription || data.idDescription;

  if (data.autoTranslateEn || !enDegree || !enDescription) {
    if (!data.enDegree && data.idDegree) {
      enDegree = await autoTranslate(data.idDegree, "id", "en");
    }
    if (!data.enDescription && data.idDescription) {
      enDescription = await autoTranslate(data.idDescription, "id", "en");
    }
  }

  await prisma.$transaction(async (tx) => {
    let studyId = data.id;
    if (studyId) {
      await tx.study.update({
        where: { id: studyId },
        data: {
          institution: data.institution,
          timeframe: data.timeframe,
          order: data.order,
          images: data.images ? (data.images as Prisma.InputJsonValue) : undefined,
        },
      });
    } else {
      const created = await tx.study.create({
        data: {
          profileId: "default",
          institution: data.institution,
          timeframe: data.timeframe,
          order: data.order,
          images: data.images ? (data.images as Prisma.InputJsonValue) : undefined,
        },
      });
      studyId = created.id;
    }

    await tx.studyTranslation.upsert({
      where: { studyId_locale: { studyId, locale: "id" } },
      update: { degree: data.idDegree, description: data.idDescription },
      create: {
        studyId,
        locale: "id",
        degree: data.idDegree,
        description: data.idDescription,
      },
    });

    await tx.studyTranslation.upsert({
      where: { studyId_locale: { studyId, locale: "en" } },
      update: { degree: enDegree, description: enDescription },
      create: {
        studyId,
        locale: "en",
        degree: enDegree,
        description: enDescription,
      },
    });
  });

  invalidateContentCache();
  revalidatePath("/about");
  revalidatePath("/en/about");
  return { success: true };
}

export async function deleteStudyAction(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");
  await prisma.study.delete({ where: { id } });

  invalidateContentCache();
  revalidatePath("/about");
  revalidatePath("/en/about");
  return { success: true };
}

// 10. Technical Skills CRUD
export interface SaveSkillGroupInput {
  id?: string;
  title: string;
  order: number;
  skills: Array<{ name: string; icon?: string }>;
  idTitle: string;
  idDescription?: string;
  enTitle?: string;
  enDescription?: string;
  autoTranslateEn?: boolean;
}

export async function saveSkillGroupAction(data: SaveSkillGroupInput) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");

  let enTitle = data.enTitle || data.idTitle;
  let enDescription = data.enDescription || data.idDescription || "";

  if (data.autoTranslateEn || !enTitle) {
    enTitle = await autoTranslate(data.idTitle, "id", "en");
    if (data.idDescription) {
      enDescription = await autoTranslate(data.idDescription, "id", "en");
    }
  }

  await prisma.$transaction(async (tx) => {
    let groupId = data.id;
    if (groupId) {
      await tx.skillGroup.update({
        where: { id: groupId },
        data: {
          title: data.title,
          order: data.order,
          skills: data.skills as unknown as Prisma.InputJsonValue,
        },
      });
    } else {
      const created = await tx.skillGroup.create({
        data: {
          profileId: "default",
          title: data.title,
          order: data.order,
          skills: data.skills as unknown as Prisma.InputJsonValue,
        },
      });
      groupId = created.id;
    }

    await tx.skillGroupTranslation.upsert({
      where: { skillGroupId_locale: { skillGroupId: groupId, locale: "id" } },
      update: { title: data.idTitle, description: data.idDescription },
      create: {
        skillGroupId: groupId,
        locale: "id",
        title: data.idTitle,
        description: data.idDescription,
      },
    });

    await tx.skillGroupTranslation.upsert({
      where: { skillGroupId_locale: { skillGroupId: groupId, locale: "en" } },
      update: { title: enTitle, description: enDescription },
      create: {
        skillGroupId: groupId,
        locale: "en",
        title: enTitle,
        description: enDescription,
      },
    });
  });

  invalidateContentCache();
  revalidatePath("/about");
  revalidatePath("/en/about");
  return { success: true };
}

export async function deleteSkillGroupAction(id: string) {
  if (!(await verifyAuth())) throw new Error("Unauthorized");
  await prisma.skillGroup.delete({ where: { id } });

  invalidateContentCache();
  revalidatePath("/about");
  revalidatePath("/en/about");
  return { success: true };
}
