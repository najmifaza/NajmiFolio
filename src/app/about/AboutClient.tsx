"use client";

import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Schema,
  Row,
  Accordion,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import { GitHubContribution } from "@/components";

export default function AboutClient() {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const structure = useMemo(
    () => [
      { title: about.intro.title, display: about.intro.display, items: [] },
      {
        title: about.work.title,
        display: about.work.display,
        items: about.work.experiences.map((experience) => experience.company),
      },
      {
        title: about.Organization.title,
        display: about.Organization.display,
        items: about.Organization.experiences.map(
          (experience) => experience.company,
        ),
      },
      {
        title: about.studies.title,
        display: about.studies.display,
        items: about.studies.institutions.map(
          (institution) => institution.name,
        ),
      },
      {
        title: about.technical.title,
        display: about.technical.display,
        items: about.technical.skills.map((skill) => skill.title),
      },
    ],
    [],
  );

  const createAccordionItemsFromExperiences = (
    experiences: typeof about.work.experiences,
  ) =>
    experiences.map((experience) => {
      const firstImage = experience.images?.[0];
      const restImages = experience.images?.slice(1) || [];

      const titleNode = (
        <Row fillWidth vertical="center" gap="12">
          <Column>
            <Text variant="heading-strong-s">{experience.company}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {experience.role} • {experience.timeframe}
            </Text>
          </Column>
        </Row>
      );

      const contentNode = (
        <Column fillWidth gap="12" padding="0">
          <Column as="ul" gap="8">
            {experience.achievements.map((achievement, achievementIdx) => (
              <Text
                as="li"
                variant="body-default-m"
                key={`${experience.company}-${achievementIdx}`}
              >
                {achievement}
              </Text>
            ))}
          </Column>

          {experience.images && experience.images.length > 0 && (
            <Row fillWidth paddingTop="0" gap="12" wrap horizontal="start">
              {experience.images.map((image, idx) => (
                <Row
                  key={idx}
                  border="neutral-medium"
                  radius="m"
                  fitWidth
                  style={{ width: 200, height: 112, overflow: "hidden" }}
                >
                  <Media
                    radius="m"
                    aspectRatio="16/9"
                    sizes="160"
                    alt={image.alt}
                    src={image.src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setZoomImage(image.src)}
                  />
                </Row>
              ))}
            </Row>
          )}
          {/* 
          {restImages.length > 0 && (
            <Row fillWidth gap="12" wrap>
              {restImages.map((image, idx) => (
                <Row
                  key={idx}
                  border="neutral-medium"
                  radius="m"
                  fitWidth
                  style={{ width: 160, height: 90, overflow: "hidden" }}
                >
                  <Media
                    radius="m"
                    aspectRatio="16/9"
                    sizes="160"
                    alt={image.alt}
                    src={image.src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => setZoomImage(image.src)}
                  />
                </Row>
              ))}
            </Row>
          )} */}
        </Column>
      );

      return {
        title: titleNode,
        content: contentNode,
      };
    });

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image="/images/og/home.png"
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}

      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="l"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}

        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{ backdropFilter: "blur(var(--static-space-1))" }}
              >
                <Icon
                  paddingLeft="12"
                  name="project"
                  onBackground="brand-weak"
                />
                <Row paddingX="8">View My Project</Row>
                <IconButton
                  href={"project"}
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-l">
              {person.lastName}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column
              textVariant="body-default-l"
              fillWidth
              gap="m"
              marginBottom="l"
            >
              {about.intro.description}
              <GitHubContribution />
            </Column>
          )}

          {about.work.display && (
            <>
              <Heading
                as="h2"
                id={about.work.title}
                variant="display-strong-s"
                marginBottom="m"
              >
                {about.work.title}
              </Heading>
              <Column fillWidth gap="0">
                {createAccordionItemsFromExperiences(
                  about.work.experiences,
                ).map((item, idx) => (
                  <Accordion
                    key={`${item.title}-${idx}`}
                    title={item.title}
                    size="m"
                    radius="m"
                    className={styles.noArrowAccordion}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      overflow: "visible",
                      marginBottom: 0,
                    }}
                  >
                    {item.content}
                  </Accordion>
                ))}
              </Column>
            </>
          )}

          {about.Organization.display && (
            <>
              <Heading
                as="h2"
                id={about.Organization.title}
                variant="display-strong-s"
                marginBottom="m"
                marginTop="m"
              >
                {about.Organization.title}
              </Heading>
              <Column fillWidth gap="0">
                {createAccordionItemsFromExperiences(
                  about.Organization.experiences,
                ).map((item, idx) => (
                  <Accordion
                    key={`${item.title}-${idx}`}
                    title={item.title}
                    size="m"
                    radius="m"
                    className={styles.noArrowAccordion}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      overflow: "visible",
                      marginBottom: 0,
                    }}
                  >
                    {item.content}
                  </Accordion>
                ))}
              </Column>
            </>
          )}

          {about.studies.display && (
            <>
              <Heading
                as="h2"
                id={about.studies.title}
                variant="display-strong-s"
                marginBottom="m"
                marginTop="m"
              >
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Column
                    key={`${institution.name}-${index}`}
                    fillWidth
                    gap="4"
                  >
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text
                      variant="heading-default-xs"
                      onBackground="neutral-weak"
                    >
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.technical.display && (
            <>
              <Heading
                as="h2"
                id={about.technical.title}
                variant="display-strong-s"
                marginBottom="40"
              >
                {about.technical.title}
              </Heading>
              <Column fillWidth gap="l">
                {about.technical.skills.map((skill, index) => (
                  <Column key={`${skill}-${index}`} fillWidth gap="4">
                    <Text id={skill.title} variant="heading-strong-l">
                      {skill.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag
                            key={`${skill.title}-${tagIndex}`}
                            size="l"
                            prefixIcon={tag.icon}
                          >
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image, index) => (
                          <Row
                            key={index}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                            style={{ overflow: "hidden" }}
                          >
                            <Media
                              radius="m"
                              aspectRatio="16/9"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() => setZoomImage(image.src)}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>

      {zoomImage && (
        <div className={styles.zoomOverlay} onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Zoom" className={styles.zoomImage} />
        </div>
      )}
    </Column>
  );
}
