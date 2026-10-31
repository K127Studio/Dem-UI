const svg = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/></svg>`,
  )}`;

/** Local placeholders, so the stories need no network. */
export const sampleImage = svg("#2563eb", "#7c3aed");
export const sampleImageWarm = svg("#f59e0b", "#dc2626");

export const sampleText =
  "Generic text for the story. It stands in for the content a project would load from its own database.";

export const sampleMarkdown = `# Heading

A paragraph with **bold**, *italic*, \`inline code\` and a [link](https://example.com).

## Lists

- First item
- Second item
  - Nested item

1. One
2. Two

> A blockquote.

\`\`\`
const code = "block";
\`\`\`

---

HTML is escaped: <script>alert(1)</script>
`;
