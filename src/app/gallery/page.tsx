import { Flex, Meta, Schema, Heading } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";
import styles from "@/components/about/about.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: "/images/og/home.png",
    path: gallery.path,
  });
}

export default function Gallery() {
  return (
    <Flex maxWidth="l" direction="column" gap="32">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image="/images/og/home.png"
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {/* 3. Masukkan judul ke sini agar muncul di layar */}
      <Heading
        style={{ fontSize: "22px", marginTop: "20px" }}
        padding="4"
        className={styles.textAlign}
        align="center"
      >
        Licenses & certifications
      </Heading>
      <GalleryView />
    </Flex>
  );
}
