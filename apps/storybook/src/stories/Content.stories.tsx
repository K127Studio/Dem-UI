import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Paragraph } from "@dem-ui/base";
import { GridHero, GridHeroPanel, Markdown, ModuleRenderer, ParagraphWithImage, Quote, SimpleHero, Spacer, type ContentModule, type ModuleRenderProps } from "@dem-ui/content";
import { ModuleListEditor } from "@dem-ui/content/editors";
import { Button } from "@dem-ui/base";
import { sampleImage, sampleImageWarm, sampleMarkdown, sampleText } from "./samples";

export const ParagraphStory: StoryObj<typeof Paragraph> = {
  name: "Paragraph",
  render: (args) => <Paragraph {...args} />,
  args: { children: sampleText, size: "md", weight: "normal", variant: "default", align: "left", colorClassName: "text-foreground", skeleton: false },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] },
    weight: { control: "inline-radio", options: ["normal", "medium", "bold"] },
    variant: { control: "inline-radio", options: ["default", "muted", "error"] },
    align: { control: "inline-radio", options: ["left", "center", "right", "justify"] },
    as: { control: "select", options: ["p", "span", "div", "h1", "h2"] },
  },
};

export const ParagraphWithImageStory: StoryObj<typeof ParagraphWithImage> = {
  name: "ParagraphWithImage",
  render: (args) => <ParagraphWithImage {...args} />,
  args: { children: sampleText, imageSrc: sampleImage, imagePosition: "left", imageAspectRatio: "video", size: "lg", overlayOpacity: 0.4, colorClassName: "text-foreground" },
  argTypes: {
    imagePosition: { control: "select", options: ["left", "right", "top", "bottom", "background"] },
    imageAspectRatio: { control: "select", options: ["square", "video", "portrait", "wide", "auto"] },
    overlayOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    imageSrc: { control: false },
  },
};

export const ImagePositions: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 text-foreground">
      {(["left", "right", "top", "bottom", "background"] as const).map((imagePosition) => (
        <ParagraphWithImage key={imagePosition} imageSrc={sampleImage} imagePosition={imagePosition} size="lg">
          {`imagePosition="${imagePosition}". ${sampleText}`}
        </ParagraphWithImage>
      ))}
    </div>
  ),
};

export const SpacerStory: StoryObj<typeof Spacer> = {
  name: "Spacer",
  render: (args) => (
    <div className="text-foreground">
      <p>Above</p>
      <Spacer {...args} />
      <p>Below</p>
    </div>
  ),
  args: { height: "lg", type: "divider", lineWidth: "100%", lineHeight: "2", opacity: 1 },
  argTypes: {
    height: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl", "10vh", "20vh"] },
    type: { control: "inline-radio", options: ["spacer", "divider"] },
    lineHeight: { control: "select", options: ["1", "2", "4", "8", "16", "24", "32"] },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
  },
};

export const QuoteStory: StoryObj<typeof Quote> = {
  name: "Quote",
  render: (args) => <Quote {...args} />,
  args: {
    children: "A sentence worth quoting.",
    author: "Author Name",
    authorDates: "1900 - 1980",
    authorInfo: "Writer",
    showIcons: true,
    colorClassName: "text-foreground",
    bgColorClassName: "bg-surface-muted",
  },
};

export const MarkdownStory: StoryObj<typeof Markdown> = {
  name: "Markdown",
  render: (args) => <Markdown {...args} />,
  args: { content: sampleMarkdown, size: "md", align: "left", colorClassName: "text-foreground" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "2xl"] },
    align: { control: "inline-radio", options: ["left", "center", "right", "justify"] },
    classes: { control: false },
  },
};

export const SimpleHeroStory: StoryObj<typeof SimpleHero> = {
  name: "SimpleHero",
  render: (args) => (
    <SimpleHero {...args}>
      <Button variant="accent">Primary action</Button>
      <Button variant="glass">Secondary</Button>
    </SimpleHero>
  ),
  args: { title: "Hero title", subtitle: "A subtitle that explains the page.", imageSrc: sampleImage, align: "center", vAlign: "center", overlayOpacity: 0.4 },
  argTypes: {
    align: { control: "inline-radio", options: ["left", "center", "right"] },
    vAlign: { control: "inline-radio", options: ["top", "center", "bottom"] },
    overlayOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    imageSrc: { control: false },
    children: { control: false },
  },
  parameters: { layout: "fullscreen" },
};

export const GridHeroStory: StoryObj<typeof GridHero> = {
  name: "GridHero",
  render: (args) => (
    <GridHero {...args}>
      <GridHeroPanel className="bg-surface text-foreground">
        <h2 className="text-4xl font-bold">Top panel</h2>
        <p className="mt-4 text-lg">Panels stack and share the height.</p>
      </GridHeroPanel>
      <GridHeroPanel className="bg-surface-muted text-foreground">
        <p>Bottom panel.</p>
        <div className="mt-6">
          <Button>Action</Button>
        </div>
      </GridHeroPanel>
    </GridHero>
  ),
  args: { imageSrc: sampleImageWarm, imagePosition: "left" },
  argTypes: {
    imagePosition: { control: "inline-radio", options: ["left", "right"] },
    imageSrc: { control: false },
    children: { control: false },
  },
  parameters: { layout: "fullscreen" },
};

// The exact stored shape: `imageUrl` is an old field name the renderer still accepts.
const POST: ContentModule[] = [
  { id: "1", type: "simpleHero", props: { title: "Rendered from JSON", subtitle: "Same shape the databases hold.", imageSrc: sampleImage, align: "left", vAlign: "bottom" } },
  { id: "s1", type: "spacer", props: { height: "md" } },
  { id: "2", type: "paragraph", props: { children: sampleText, size: "xl", align: "center", colorClassName: "text-foreground py-12" } },
  { id: "s2", type: "spacer", props: { height: "lg", type: "divider", lineWidth: "50%", lineHeight: "2" } },
  { id: "3", type: "paragraphWithImage", props: { children: sampleText, imageUrl: sampleImageWarm, imagePosition: "right", size: "lg", colorClassName: "text-foreground" } },
  { id: "s3", type: "spacer", props: { height: "md" } },
  { id: "4", type: "quote", props: { children: "Modules render from data.", author: "Dem UI", colorClassName: "text-foreground" } },
  { id: "s4", type: "spacer", props: { height: "sm", type: "divider" } },
  { id: "5", type: "markdown", props: { content: "## Markdown module\n\nWith a **bold** word.", colorClassName: "text-foreground" } },
  { id: "s5", type: "spacer", props: { height: "md" } },
  { id: "6", type: "gridHero", props: { imageSrc: sampleImage, imagePosition: "right", topTitle: "Grid hero", topSubtitle: "From stored fields", topTitleColorClassName: "text-foreground", topSubtitleColorClassName: "text-foreground-muted", bottomParagraph: "Lower panel.", bottomParagraphColorClassName: "text-foreground", hasButton: true, buttonLabel: "Discover", buttonHref: "#", buttonVariant: "primary" } },
];

export const Renderer: StoryObj = {
  name: "ModuleRenderer",
  render: () => <ModuleRenderer modules={POST} />,
  parameters: { layout: "fullscreen" },
};

function BrandQuote({ props }: ModuleRenderProps) {
  return <blockquote className="border-l-4 border-rose-600 p-6 text-xl text-rose-700 italic">{props.children}</blockquote>;
}

export const RendererOverrides: StoryObj = {
  name: "ModuleRenderer: overrides and transformProps",
  render: () => (
    <ModuleRenderer
      modules={[
        { type: "quote", props: { children: "This quote comes from the project's own component, for {{brand}}." } },
        { type: "paragraph", props: { children: "A variable replaced at render: {{brand}}.", colorClassName: "text-foreground" } },
        { type: "notRegistered", props: {} },
      ]}
      overrides={{ quote: BrandQuote }}
      transformProps={({ props }) => ({
        ...props,
        children: typeof props.children === "string" ? props.children.replaceAll("{{brand}}", "Dem UI") : props.children,
      })}
      wrapModule={(element) => <div className="mx-auto max-w-2xl p-4">{element}</div>}
      renderUnknown={(module) => <p className="p-4 text-sm text-foreground">Unknown module: {module.type}</p>}
    />
  ),
};

export const Editor: StoryObj = {
  name: "ModuleListEditor (with live preview)",
  render: function Render() {
    const [modules, setModules] = useState<ContentModule[]>(POST.slice(1, 6));
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ModuleListEditor
          modules={modules}
          onChange={setModules}
          emptyText="Add a module below."
          fontOptions={[
            { value: "standard", label: "Standard" },
            { value: "serif", label: "Serif" },
          ]}
          imageOptimization={{ compressImage: true, compressionRate: 0.8, convertToWebp: true }}
          uploadImage={(file) => new Promise((resolve) => setTimeout(() => resolve(URL.createObjectURL(file)), 800))}
        />
        <div className="min-w-0 rounded-lg border border-border p-4">
          <ModuleRenderer modules={modules} fontClasses={{ standard: "font-sans", serif: "font-serif" }} />
        </div>
      </div>
    );
  },
};

const meta: Meta = { title: "Content/Modules" };
export default meta;
