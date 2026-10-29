"use client";

import { useAdminToast } from "@/app/admin/components/AdminToast";
import ProfileForm from "@/app/admin/forms/ProfileForm";
import { Column, Heading, Row, Text } from "@once-ui-system/core";
import { useRouter } from "next/navigation";

export default function ProfileManager({ profile }: { profile: any }) {
  const router = useRouter();
  const { showToast } = useAdminToast();

  return (
    <Column gap="24" fillWidth>
      <Row
        vertical="center"
        horizontal="between"
        paddingBottom="20"
        borderBottom="neutral-alpha-weak"
        wrap
        gap="16"
      >
        <Column gap="4">
          <Heading as="h1" variant="heading-strong-m" onBackground="neutral-strong">
            Profile & Personal Bio
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Ubah avatar, informasi diri, kontak, dan narasi biografi dwibahasa.
          </Text>
        </Column>
      </Row>

      <ProfileForm
        profile={profile}
        onSave={() => {
          showToast("success", "Profil & Bio berhasil diperbarui!");
          router.refresh();
        }}
      />
    </Column>
  );
}
