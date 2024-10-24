"use client";
import { CodeBlock, a11yLight, a11yDark } from "react-code-blocks";
export default function BlogCodeBlock({ text }: { text: string }) {
  const isDarkMode = true;
  return (
    <CodeBlock
      customStyle={{
        backgroundColor: "var(--background-start-rgb)",
        fontFamily: "monospace",
        border: "1px solid",
        borderColor: "var(--foreground-rgb)",
        padding: "1rem",
        marginBottom: "16px",
      }}
      language="typescript"
      theme={isDarkMode ? a11yDark : a11yLight}
      showLineNumbers={false}
      text={text}
    />
  );
}
