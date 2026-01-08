"use client";

import { Media, Text, Flex, Grid, SmartLink } from "@once-ui-system/core";
import { gallery } from "@/resources";

export default function GalleryView() {
  return (
    <Grid
      columns={3}
      s={{ columns: 1 }}
      gap="40" // Jarak antar kartu
      fillWidth
    >
      {gallery.certificates.map((cert, index) => (
        <Flex key={index} direction="column" fillWidth gap="16">
          {/* Bagian Gambar Sertifikat */}
          <Media
            radius="m"
            aspectRatio="16 / 9" // Rasio landscape standar sertifikat
            src={cert.image}
            alt={cert.title}
            objectFit="cover" // Atau 'contain' jika ingin melihat seluruh sertifikat tanpa terpotong
            style={{ border: "1px solid var(--neutral-border-weak)" }} // Opsional: border tipis
          />

          {/* Bagian Informasi Teks */}
          <Flex direction="column" gap="4">
            <Text variant="body-strong-l">{cert.title}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {cert.issuer} • {cert.date}
            </Text>

            {/* Tombol Link (Jika ada URL) */}
            {cert.url && (
              <Flex marginTop="8">
                <SmartLink href={cert.url} suffixIcon="arrowUpRight">
                  <Text variant="body-default-s">View Credential</Text>
                </SmartLink>
              </Flex>
            )}
          </Flex>
        </Flex>
      ))}
    </Grid>
  );
}
