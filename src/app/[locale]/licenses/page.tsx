import { Flex, Meta, Schema, Heading } from "@once-ui-system/core";
import LicensesView from "@/components/licenses/LicensesView";
import { baseURL } from "@/resources";
import { getDictionary } from "@/resources/i18n";
import styles from "@/components/about/about.module.scss";

export async function generateMetadata() {
  const { licenses } = await getDictionary();
  return Meta.generate({
    title: licenses.title,
    description: licenses.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(licenses.title)}`,
    path: licenses.path,
  });
}

export default async function Licenses() {
  const dict = await getDictionary();
  const { licenses, person } = dict;

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
      <Heading
        style={{ fontSize: "22px", marginTop: "20px" }}
        padding="4"
        className={styles.textAlign}
        align="center"
      >
        {licenses.label}
      </Heading>
      <LicensesView />
    </Flex>
  );
}
