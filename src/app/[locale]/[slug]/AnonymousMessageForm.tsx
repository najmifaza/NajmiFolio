"use client";

import {
  Button,
  Column,
  Feedback,
  Flex,
  Heading,
  Input,
  Row,
  StatusIndicator,
  Text,
  Textarea,
} from "@once-ui-system/core";
import type React from "react";
import { useState } from "react";
import { sendAnonymousMessageAction } from "./actions";

interface AnonymousMessageFormProps {
  slug: string;
  roomTitle: string;
  roomDescription?: string | null;
  isOpen: boolean;
  statusMessage?: string;
  indicatorColor: "green" | "yellow" | "red" | "gray";
}

export default function AnonymousMessageForm({
  slug,
  roomTitle,
  roomDescription,
  isOpen,
  statusMessage,
  indicatorColor,
}: AnonymousMessageFormProps) {
  const [content, setContent] = useState("");
  const [senderTag, setSenderTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOpen || submitting) return;

    if (!content.trim()) {
      setErrorMessage("Pesan tidak boleh kosong");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await sendAnonymousMessageAction({
        slug,
        content,
        senderTag: senderTag.trim() || undefined,
      });

      if (res.success) {
        setSubmitted(true);
        setContent("");
        setSenderTag("");
      } else {
        setErrorMessage(res.error || "Gagal mengirim pesan");
      }
    } catch (_err) {
      setErrorMessage("Terjadi kendala jaringan. Coba beberapa saat lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Column
      fillWidth
      maxWidth="m"
      gap="24"
      horizontal="center"
      align="center"
      paddingX="s"
      paddingY="24"
    >
      <Column fillWidth gap="12" horizontal="center" align="center" paddingBottom="8">
        <Row
          gap="8"
          vertical="center"
          horizontal="center"
          paddingX="12"
          paddingY="4"
          radius="full"
          border="neutral-alpha-weak"
          background="surface"
        >
          <StatusIndicator color={indicatorColor} size="s" />
          <Text variant="label-default-s" onBackground="neutral-weak">
            {statusMessage || (isOpen ? "Menerima Pesan Anonim" : "Pesan Ditutup")}
          </Text>
        </Row>

        <Heading variant="display-strong-s" align="center" wrap="balance">
          {roomTitle}
        </Heading>

        {roomDescription && (
          <Text
            variant="body-default-m"
            onBackground="neutral-weak"
            align="center"
            wrap="balance"
            style={{ maxWidth: "600px" }}
          >
            {roomDescription}
          </Text>
        )}
      </Column>

      <Column
        fillWidth
        background="surface"
        border="neutral-alpha-weak"
        radius="l"
        padding="l"
        gap="16"
        style={{
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
        }}
      >
        {submitted ? (
          <Column fillWidth gap="16" horizontal="center" align="center" paddingY="24">
            <Feedback
              variant="success"
              title="Pesan Anonim Terkirim!"
              description="Pesan kamu telah berhasil dikirim dengan aman. Identitasmu tetap anonim dan rahasia."
            />
            <Button variant="secondary" size="m" onClick={() => setSubmitted(false)}>
              Kirim Pesan Lain
            </Button>
          </Column>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {!isOpen && (
              <Feedback
                variant="warning"
                title="Pemberitahuan Waktu"
                description={statusMessage || "Ruang pesan ini saat ini tidak menerima pesan baru."}
              />
            )}

            {errorMessage && (
              <Feedback variant="danger" title="Gagal Mengirim" description={errorMessage} />
            )}

            <Column fillWidth gap="4">
              <Text variant="label-default-s" onBackground="neutral-strong">
                Pesan / Feedback *
              </Text>
              <Textarea
                id="anonymous-message-content"
                placeholder="Tuliskan pertanyaan, kritik, saran, atau kendala praktikum secara jujur..."
                value={content}
                disabled={!isOpen || submitting}
                onChange={(e) => setContent(e.target.value)}
                lines={6}
                required
              />
              <Row horizontal="between" fillWidth paddingX="4">
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  Identitas pengirim 100% anonim
                </Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  {content.length} / 2500
                </Text>
              </Row>
            </Column>

            <Column fillWidth gap="4">
              <Text variant="label-default-s" onBackground="neutral-strong">
                Nama Samaran / Kelompok (Opsional)
              </Text>
              <Input
                id="anonymous-message-sender-tag"
                placeholder="Contoh: Praktikan Modul 2 / Kelompok 4 (atau kosongkan)"
                value={senderTag}
                disabled={!isOpen || submitting}
                onChange={(e) => setSenderTag(e.target.value)}
                maxLength={50}
              />
            </Column>

            <Button
              variant="primary"
              size="l"
              fillWidth
              disabled={!isOpen || submitting}
              loading={submitting}
              type="submit"
            >
              {submitting ? "Mengirim Pesan..." : "Kirim Pesan Anonim"}
            </Button>
          </form>
        )}
      </Column>
    </Column>
  );
}
