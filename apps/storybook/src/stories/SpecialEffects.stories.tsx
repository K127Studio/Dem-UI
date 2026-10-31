import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@dem-ui/base";
import { ChromeBlobHero, type ChromeBlobHeroProps } from "@dem-ui/special-effects/chrome-blob";
import { Grainient, GrainientHero, type GrainientHeroProps } from "@dem-ui/special-effects/grainient";

const heroContent = (
  <>
    <h1 className="font-display text-5xl text-black md:text-7xl">Hero title</h1>
    <p className="max-w-xl text-lg text-black/70">Whatever you pass as children sits on top of the canvas.</p>
    <div className="mt-4">
      <Button>Primary action</Button>
    </div>
  </>
);

export const ChromeBlob: StoryObj<ChromeBlobHeroProps> = {
  name: "Hero: ChromeBlob (three)",
  render: (args) => <ChromeBlobHero {...args}>{heroContent}</ChromeBlobHero>,
  args: { interactive: true, quality: "auto", maxFps: 30, align: "center", vAlign: "center", heightClassName: "min-h-[80vh]" },
  argTypes: {
    align: { control: "inline-radio", options: ["left", "center", "right"] },
    vAlign: { control: "inline-radio", options: ["top", "center", "bottom"] },
    quality: { control: "inline-radio", options: ["auto", "high", "medium", "low"] },
    blobColor: { control: "color" },
    backgroundColor: { control: "color" },
  },
  parameters: { layout: "fullscreen" },
};

export const GrainientHeroStory: StoryObj<GrainientHeroProps> = {
  name: "Hero: Grainient (ogl)",
  render: (args) => <GrainientHero {...args}>{heroContent}</GrainientHero>,
  args: { color1: "#FF9FFC", color2: "#5227FF", color3: "#B497CF", timeSpeed: 0.25, grainAmount: 0.1, warpStrength: 1, contrast: 1.5, zoom: 0.9, heightClassName: "min-h-[80vh]" },
  argTypes: {
    color1: { control: "color" },
    color2: { control: "color" },
    color3: { control: "color" },
    timeSpeed: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    grainAmount: { control: { type: "range", min: 0, max: 0.5, step: 0.01 } },
    warpStrength: { control: { type: "range", min: 0, max: 5, step: 0.1 } },
  },
  parameters: { layout: "fullscreen" },
};

export const GrainientAlone: StoryObj = {
  name: "Grainient as a background",
  render: () => (
    <div className="h-64 w-full max-w-xl overflow-hidden rounded-card">
      <Grainient color1="#ffaa33" color2="#ff6600" color3="#150b00" />
    </div>
  ),
};

const meta: Meta = { title: "Special effects/Heroes" };
export default meta;
