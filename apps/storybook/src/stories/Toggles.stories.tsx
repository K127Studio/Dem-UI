import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { UIProvider, useColorMode, type ThemeMode } from "@dem-ui/foundation";
import { Button } from "@dem-ui/base";
import { PushButtonToggle, SeventiesToggle, SkeuomorphicToggle } from "@dem-ui/toggles";

function useLocalDark() {
  return useState(true);
}

export const Seventies: StoryObj<typeof SeventiesToggle> = {
  name: "Toggle: Seventies",
  render: function Render(args) {
    const [isDark, setIsDark] = useLocalDark();
    return (
      <div className="flex flex-col gap-8">
        <div className="w-64">
          <SeventiesToggle {...args} isDark={isDark} onChange={setIsDark} />
        </div>
        <SeventiesToggle isDark={isDark} onChange={setIsDark} variant="mini" />
      </div>
    );
  },
  args: { brand: "Dem UI", size: 78, variant: "full" },
  argTypes: { variant: { control: "inline-radio", options: ["full", "mini"] }, isDark: { control: false }, onChange: { control: false } },
};

export const Skeuomorphic: StoryObj<typeof SkeuomorphicToggle> = {
  name: "Toggle: Skeuomorphic / Neumorphic",
  render: function Render(args) {
    const [isDark, setIsDark] = useLocalDark();
    return (
      <div className={`flex flex-wrap items-center gap-10 rounded-lg p-10 ${isDark ? "bg-[#273345]" : "bg-[#dbc9b1]"}`}>
        <SkeuomorphicToggle {...args} isDark={isDark} onChange={setIsDark} />
        <PushButtonToggle mode={args.mode} size={args.size} isDark={isDark} onChange={setIsDark} />
      </div>
    );
  },
  args: { mode: "skeuomorphism", size: 5 },
  argTypes: {
    mode: { control: "inline-radio", options: ["skeuomorphism", "neumorphism"] },
    size: { control: { type: "range", min: 2, max: 12 } },
    lightColor: { control: "color" },
    darkColor: { control: "color" },
    isDark: { control: false },
    onChange: { control: false },
  },
};

export const ToggleModes: StoryObj = {
  name: "Toggle: the two modes compared",
  render: function Render() {
    const [isDark, setIsDark] = useLocalDark();
    return (
      <div className={`grid grid-cols-1 gap-10 rounded-lg p-10 sm:grid-cols-2 ${isDark ? "bg-[#273345] text-white" : "bg-[#dbc9b1] text-black"}`}>
        {(["skeuomorphism", "neumorphism"] as const).map((mode) => (
          <div key={mode} className="flex flex-col gap-6">
            <code className="text-sm">mode="{mode}"</code>
            <SkeuomorphicToggle mode={mode} size={5} isDark={isDark} onChange={setIsDark} />
            <PushButtonToggle mode={mode} size={5} isDark={isDark} onChange={setIsDark} />
          </div>
        ))}
      </div>
    );
  },
};

export const DrivesTheMode: StoryObj = {
  name: "Toggle driving the colour mode",
  render: function Render(_, context) {
    const { mode, isDark, setIsDark } = useColorMode({ storageKey: "dem-ui-story-mode", defaultMode: context.globals.mode as ThemeMode });
    return (
      <UIProvider mode={mode}>
        <div data-testid="surface" className="flex flex-col gap-6 bg-background p-8 text-foreground">
          <p>useColorMode remembers the choice in localStorage. Now: {mode}.</p>
          <div className="w-64">
            <SeventiesToggle isDark={isDark} onChange={setIsDark} brand="Dem UI" />
          </div>
          <SkeuomorphicToggle isDark={isDark} onChange={setIsDark} />
          <Button className="w-fit">A themed button</Button>
        </div>
      </UIProvider>
    );
  },
};

const meta: Meta = { title: "Toggles" };
export default meta;
