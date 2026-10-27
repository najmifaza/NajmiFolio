import { prisma } from "@/lib/prisma";
import CertificatesManager from "./CertificatesManager";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { order: "asc" },
  });

  return <CertificatesManager initialCertificates={JSON.parse(JSON.stringify(certificates))} />;
}
