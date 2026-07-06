import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import { Meta } from "@once-ui-system/core";
import AboutClient from "./AboutClient";

export async function generateMetadata() {
  const { about } = await getDictionary();
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  return <AboutClient />;
}
