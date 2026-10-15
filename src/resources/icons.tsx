import { Icon as IconifyIcon } from "@iconify/react";
import { iconLibrary as defaultOnceIcons } from "@once-ui-system/core";
import type React from "react";
import type { IconType } from "react-icons";

import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiArrowUpRight,
  HiCalendarDays,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
  HiEnvelope,
  HiOutlineComputerDesktop,
  HiOutlineDocument,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineGlobeAmericas,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineLink,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

import {
  PiBookBookmarkDuotone,
  PiGridFourDuotone,
  PiHouseDuotone,
  PiImageDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";

import {
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiC,
  SiCoreldraw,
  SiCss3,
  SiElementor,
  SiFigma,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiSupabase,
  SiWoocommerce,
  SiWordpress,
} from "react-icons/si";

import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaThreads,
  FaWhatsapp,
  FaX,
  FaXTwitter,
} from "react-icons/fa6";

export const baseIconLibrary: Record<string, IconType> = {
  ...defaultOnceIcons,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  chevronDown: HiChevronDown,
  chevronUp: HiChevronUp,
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  globeId: HiOutlineGlobeAsiaAustralia,
  globeEn: HiOutlineGlobeAmericas,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  licenses: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  twitter: FaXTwitter,
  threads: FaThreads,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  javascript: SiJavascript,
  wordpress: SiWordpress,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  instagram: FaInstagram,
  html: SiHtml5,
  css: SiCss3,
  c: SiC,
  postgree: SiPostgresql,
  python: SiPython,
  sql: SiMysql,
  mongodb: SiMongodb,
  elementor: SiElementor,
  woocommerce: SiWoocommerce,
  Adobephotoshop: SiAdobephotoshop,
  Adobepremierepro: SiAdobepremierepro,
  Adobelightroom: SiAdobelightroom,
  Coreldraw: SiCoreldraw,
  project: HiOutlineComputerDesktop,
};

// ==========================================
// UNIVERSAL ICONIFY RESOLVER (200,000+ Icons)
// ==========================================
export function resolveIconifyName(name: string): string {
  if (!name) return "heroicons:globe-alt";
  // If user explicitly provided prefix e.g. "lucide:terminal" or "simple-icons:docker"
  if (name.includes(":")) return name;

  const lower = name.toLowerCase().replace(/[\s\.\-_]/g, "");

  const customMap: Record<string, string> = {
    // Social / Brand
    github: "simple-icons:github",
    linkedin: "simple-icons:linkedin",
    instagram: "simple-icons:instagram",
    email: "heroicons:envelope",
    mail: "heroicons:envelope",
    twitter: "simple-icons:x",
    x: "simple-icons:x",
    threads: "simple-icons:threads",
    discord: "simple-icons:discord",
    telegram: "simple-icons:telegram",
    whatsapp: "simple-icons:whatsapp",
    facebook: "simple-icons:facebook",
    globe: "heroicons:globe-alt",
    website: "heroicons:globe-alt",
    link: "heroicons:link",
    document: "heroicons:document",
    resume: "heroicons:document",
    rocket: "heroicons:rocket-launch",
    calendar: "heroicons:calendar",
    person: "heroicons:user-circle",
    light: "heroicons:sun",
    sun: "heroicons:sun",
    dark: "heroicons:moon",
    moon: "heroicons:moon",

    // Tech / Languages / Frameworks
    react: "simple-icons:react",
    reactjs: "simple-icons:react",
    next: "simple-icons:nextdotjs",
    nextjs: "simple-icons:nextdotjs",
    vue: "simple-icons:vuedotjs",
    vuejs: "simple-icons:vuedotjs",
    svelte: "simple-icons:svelte",
    angular: "simple-icons:angular",
    typescript: "simple-icons:typescript",
    ts: "simple-icons:typescript",
    javascript: "simple-icons:javascript",
    js: "simple-icons:javascript",
    node: "simple-icons:nodedotjs",
    nodejs: "simple-icons:nodedotjs",
    tailwind: "simple-icons:tailwindcss",
    tailwindcss: "simple-icons:tailwindcss",
    docker: "simple-icons:docker",
    rust: "simple-icons:rust",
    golang: "simple-icons:go",
    go: "simple-icons:go",
    python: "simple-icons:python",
    py: "simple-icons:python",
    html: "simple-icons:html5",
    css: "simple-icons:css3",
    c: "simple-icons:c",
    cpp: "simple-icons:cplusplus",
    cplusplus: "simple-icons:cplusplus",
    csharp: "simple-icons:csharp",
    postgres: "simple-icons:postgresql",
    postgresql: "simple-icons:postgresql",
    postgree: "simple-icons:postgresql",
    mysql: "simple-icons:mysql",
    sql: "simple-icons:mysql",
    mongo: "simple-icons:mongodb",
    mongodb: "simple-icons:mongodb",
    supabase: "simple-icons:supabase",
    firebase: "simple-icons:firebase",
    prisma: "simple-icons:prisma",
    graphql: "simple-icons:graphql",
    fastapi: "simple-icons:fastapi",
    django: "simple-icons:django",
    flask: "simple-icons:flask",
    laravel: "simple-icons:laravel",
    php: "simple-icons:php",
    git: "simple-icons:git",
    linux: "simple-icons:linux",
    ubuntu: "simple-icons:ubuntu",
    nginx: "simple-icons:nginx",
    redis: "simple-icons:redis",
    kubernetes: "simple-icons:kubernetes",
    k8s: "simple-icons:kubernetes",
    figma: "simple-icons:figma",
    wordpress: "simple-icons:wordpress",
    elementor: "simple-icons:elementor",
    woocommerce: "simple-icons:woocommerce",
    photoshop: "simple-icons:adobephotoshop",
    premiere: "simple-icons:adobepremierepro",
    lightroom: "simple-icons:adobelightroom",
    coreldraw: "simple-icons:coreldraw",
    flutter: "simple-icons:flutter",
    dart: "simple-icons:dart",
    swift: "simple-icons:swift",
    kotlin: "simple-icons:kotlin",
    android: "simple-icons:android",
    apple: "simple-icons:apple",
    aws: "simple-icons:amazonwebservices",
    gcp: "simple-icons:googlecloud",
    azure: "simple-icons:microsoftazure",
    vercel: "simple-icons:vercel",
    bun: "simple-icons:bun",
    deno: "simple-icons:deno",
    vite: "simple-icons:vite",
  };

  if (customMap[lower]) {
    return customMap[lower];
  }

  // Default: resolve directly to simple-icons for any tech name
  return `simple-icons:${name.toLowerCase().replace(/[\s\.\-_]/g, "")}`;
}

// React component generator for Once UI Dynamic Proxy
function createDynamicIconComponent(iconName: string): IconType {
  const resolved = resolveIconifyName(iconName);
  const DynamicComp: IconType = (props: any) => {
    return (
      <IconifyIcon
        icon={resolved}
        width={props.size || "1em"}
        height={props.size || "1em"}
        className={props.className}
        style={props.style}
      />
    );
  };
  return DynamicComp;
}

// Universal Proxy: Matches local icons, or loads ANY icon on-demand via Iconify
export const iconLibrary: Record<string, IconType> = new Proxy(baseIconLibrary, {
  get(target, prop: string) {
    if (typeof prop === "string" && prop in target) {
      return target[prop];
    }
    if (typeof prop === "string" && prop !== "then" && prop !== "prototype") {
      return createDynamicIconComponent(prop);
    }
    return undefined;
  },
  has() {
    return true;
  },
});

// Standalone component for CMS and custom layouts
export function UniversalIcon({
  name,
  size = "1em",
  color,
  className,
  style,
}: {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const resolved = resolveIconifyName(name);
  return (
    <IconifyIcon
      icon={resolved}
      width={size}
      height={size}
      className={className}
      style={{
        color,
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export type IconLibrary = typeof iconLibrary;
export type IconName = string;
