"use client";

import styles from "@/app/admin/admin.module.scss";
import { useAdminToast } from "@/app/admin/components/AdminToast";
import ProfileForm from "@/app/admin/forms/ProfileForm";
import { useRouter } from "next/navigation";

export default function ProfileManager({ profile }: { profile: any }) {
  const router = useRouter();
  const { showToast } = useAdminToast();

  return (
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.pageTitleGroup}>
          <h1>Profile & Personal Bio</h1>
          <p>Ubah avatar, informasi diri, kontak, dan narasi biografi dwibahasa.</p>
        </div>
      </div>

      <ProfileForm
        profile={profile}
        onSave={() => {
          showToast("success", "Profil & Bio berhasil diperbarui!");
          router.refresh();
        }}
      />
    </div>
  );
}
