import { Flex, Meta, Schema, Heading } from "@once-ui-system/core";
import LicensesView from "@/components/licenses/LicensesView";
import { baseURL, licenses, person } from "@/resources";
import styles from "@/components/about/about.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: licenses.title,
    description: licenses.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(licenses.title)}`,
    path: licenses.path,
  });
}

export default function Licenses() {
  return (
    <Flex maxWidth="l" direction="column" gap="32">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={licenses.title}
        description={licenses.description}
        path={licenses.path}
        image={`/api/og/generate?title=${encodeURIComponent(licenses.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${licenses.path}`,
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
      <LicensesView />
    </Flex>
  );
}
