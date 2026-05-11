import { baseURL, about } from "@/resources";
import { Meta } from "@once-ui-system/core";
import AboutClient from "./AboutClient";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: "/images/og/home.png",
    path: about.path,
  });
}

export default function About() {
  return <AboutClient />;
}
