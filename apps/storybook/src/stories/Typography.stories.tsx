import type { Meta, StoryObj } from "@storybook/react-vite";
import { Abbr, Address, Blockquote, Cite, Code, Del, Em, Heading, Ins, Kbd, Mark, Paragraph, Q, Samp, Small, Strong, Sub, Sup, Text, Time, type HeadingLevel } from "@dem-ui/base";
import { Row } from "./HtmlElements";

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const textControls: Record<string, any> = {
  size: { control: "select", options: SIZES },
  weight: { control: "select", options: ["light", "normal", "medium", "semibold", "bold", "black"] },
  align: { control: "inline-radio", options: ["left", "center", "right", "justify"] },
  colorClassName: { control: "text" },
  as: { control: false },
  children: { control: "text" },
};

export const ParagraphStory: StoryObj<typeof Paragraph> = {
  name: "Paragraph",
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "The quick brown fox jumps over the lazy dog. Change every property from the Controls panel.",
    size: "md",
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isUppercase: false,
    isTruncated: false,
    isMuted: false,
    isMono: false,
    skeleton: false,
  },
  argTypes: { ...textControls, variant: { control: "inline-radio", options: ["default", "muted", "error"] } },
};

export const ParagraphVariations: StoryObj = {
  render: () => (
    <div className="flex flex-col">
      <Row name="isBold"><Paragraph isBold>Bold</Paragraph></Row>
      <Row name="isItalic"><Paragraph isItalic>Italic</Paragraph></Row>
      <Row name="isBold isItalic"><Paragraph isBold isItalic>Bold and italic</Paragraph></Row>
      <Row name="isUnderline"><Paragraph isUnderline>Underlined</Paragraph></Row>
      <Row name="isStrikethrough"><Paragraph isStrikethrough>Struck through</Paragraph></Row>
      <Row name="isUppercase"><Paragraph isUppercase>Uppercase</Paragraph></Row>
      <Row name="isMuted"><Paragraph isMuted>Muted</Paragraph></Row>
      <Row name="isMono"><Paragraph isMono>Monospace</Paragraph></Row>
      <Row name="isTruncated"><Paragraph isTruncated className="max-w-48">A long line that does not fit and ends with an ellipsis</Paragraph></Row>
      <Row name='variant="error"'><Paragraph variant="error">An error message</Paragraph></Row>
      <Row name='weight="black"'><Paragraph weight="black">Black weight</Paragraph></Row>
      <Row name='align="center"'><Paragraph align="center">Centred</Paragraph></Row>
      <Row name="skeleton"><Paragraph skeleton /></Row>
      {SIZES.map((size) => (
        <Row key={size} name={`size="${size}"`}><Paragraph size={size}>Size {size}</Paragraph></Row>
      ))}
    </div>
  ),
};

export const HeadingStory: StoryObj<typeof Heading> = {
  name: "Heading",
  render: (args) => <Heading {...args} />,
  args: { children: "A heading", level: 2 },
  argTypes: { ...textControls, level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] } },
};

export const HeadingLevels: StoryObj = {
  render: () => (
    <div className="flex flex-col">
      {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => (
        <Row key={level} name={`level={${level}}`}><Heading level={level}>Heading level {level}</Heading></Row>
      ))}
      <Row name='level={1} size="xl"'><Heading level={1} size="xl">An h1 that looks small</Heading></Row>
      <Row name='level={3} as="div"'><Heading level={3} as="div">Looks like h3, is a div</Heading></Row>
      <Row name="isItalic isMuted"><Heading level={3} isItalic isMuted>Italic and muted</Heading></Row>
    </div>
  ),
};

export const TextStory: StoryObj<typeof Text> = {
  name: "Text",
  render: (args) => (
    <p className="text-foreground">
      A sentence with <Text {...args} /> inside.
    </p>
  ),
  args: { children: "styled text", isBold: true, isItalic: false, isUnderline: false, isMuted: false, isMono: false },
  argTypes: textControls,
};

export const InlineElements: StoryObj = {
  name: "Inline elements",
  render: () => (
    <div className="flex flex-col">
      <Row name="Strong">Some <Strong>important</Strong> text</Row>
      <Row name="Em">Some <Em>stressed</Em> text</Row>
      <Row name="Small"><Small>Fine print</Small></Row>
      <Row name="Mark">Some <Mark>highlighted</Mark> text</Row>
      <Row name="Del">Price <Del>€20</Del> €15</Row>
      <Row name="Ins">Now <Ins>with more</Ins> content</Row>
      <Row name="Sub">H<Sub>2</Sub>O</Row>
      <Row name="Sup">E = mc<Sup>2</Sup></Row>
      <Row name="Abbr"><Abbr title="Hypertext Markup Language">HTML</Abbr></Row>
      <Row name="Cite"><Cite>The Elements of Typographic Style</Cite></Row>
      <Row name="Q"><Q>A short quote</Q> inside a sentence</Row>
      <Row name="Kbd">Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></Row>
      <Row name="Samp"><Samp>Build finished</Samp></Row>
      <Row name="Time"><Time dateTime="2026-10-31">31 October 2026</Time></Row>
      <Row name="Code">Run <Code>npm install</Code> first</Row>
      <Row name="Code isBlock"><Code isBlock language="ts">{`const answer = 42;\nconsole.log(answer);`}</Code></Row>
      <Row name="Blockquote"><Blockquote footer="Author name" cite="https://example.com">A longer quote, set apart from the text around it.</Blockquote></Row>
      <Row name="Address"><Address>Street 1<br />Phnom Penh, Cambodia</Address></Row>
    </div>
  ),
};

const meta: Meta = { title: "Base/Typography" };
export default meta;
