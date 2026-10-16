import {
  Accordion,
  AccordionGroup,
  Button,
  Card,
  CodeBlock,
  Column,
  Feedback,
  Grid,
  Heading,
  HeadingLink,
  Icon,
  InlineCode,
  Line,
  List,
  ListItem,
  Media,
  type MediaProps,
  Row,
  SmartLink,
  Table,
  Text,
  type TextProps,
} from "@once-ui-system/core";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type React from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { slugify as transliterate } from "transliteration";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  const strWithAnd = str.replace(/&/g, " and "); // Replace & with 'and'
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-", // Replace spaces with -
  }).replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children?.props?.className) {
    const { className, children } = props.children.props;

    // Extract language from className (format: language-xxx)
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }

  // Fallback for other pre tags or empty code blocks
  return <pre {...props} />;
}

function createList({ children }: { children: ReactNode }) {
  return <List>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem marginTop="4" marginBottom="8" style={{ lineHeight: "175%" }}>
      {children}
    </ListItem>
  );
}

function createHR() {
  return (
    <Row fillWidth horizontal="center">
      <Line maxWidth="40" />
    </Row>
  );
}
// Tambahkan kode ini di dalam src/components/mdx.tsx sebelum variabel 'const components'

function createTable({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        overflowX: "auto",
        margin: "1.5rem 0",
        border: "1px solid var(--neutral-border-medium)",
        borderRadius: "var(--radius-m)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9em" }}>
        {children}
      </table>
    </div>
  );
}
function createTh({ children, ...props }: any) {
  return (
    <th
      style={{
        padding: "12px 16px",
        textAlign: "left",
        borderBottom: "1px solid var(--neutral-border-medium)",
        fontWeight: 600,
        backgroundColor: "var(--neutral-alpha-weak)",
      }}
      {...props}
    >
      {children}
    </th>
  );
}

function createTd({ children, ...props }: any) {
  return (
    <td
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--neutral-border-weak)",
      }}
      {...props}
    >
      {children}
    </td>
  );
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ol: createList as any,
  ul: createList as any,
  li: createListItem as any,
  hr: createHR as any,
  table: createTable as any,
  th: createTh as any,
  td: createTd as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

function sanitizeMDX(content: string): string {
  if (!content) return "";

  // Split by fenced code blocks (```...```) to protect code contents
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts
    .map((part, index) => {
      // Odd indices are fenced code blocks; preserve verbatim
      if (index % 2 === 1) return part;

      // Also split by inline code spans (`...`)
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return inlineParts
        .map((subPart, subIndex) => {
          // Odd indices are inline code spans; preserve verbatim
          if (subIndex % 2 === 1) return subPart;

          // In prose text:
          // 1. Escape `<` that would break JSX parser (< followed by numbers, symbols, spaces, or lowercase non-tags)
          let sanitized = subPart.replace(/<(?=[0-9=\s:_-])/g, "&lt;");

          // 2. Escape curly braces in plain text so MDX does not treat them as JS variables (e.g. {task_id})
          sanitized = sanitized.replace(/\{([^{}\n]*)\}/g, "&#123;$1&#125;");

          return sanitized;
        })
        .join("");
    })
    .join("");
}

export async function CustomMDX(props: CustomMDXProps) {
  const sanitizedSource =
    typeof props.source === "string" ? sanitizeMDX(props.source) : props.source;

  try {
    return (
      <MDXRemote
        {...props}
        source={sanitizedSource}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
        components={{ ...components, ...(props.components || {}) }}
      />
    );
  } catch (err) {
    console.error("CustomMDX render error, falling back to safe pre-wrap:", err);
    return (
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{String(props.source || "")}</div>
    );
  }
}
