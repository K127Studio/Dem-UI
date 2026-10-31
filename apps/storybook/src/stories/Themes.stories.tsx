import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Icon, UIProvider, type IconName, type ThemeMode } from "@dem-ui/foundation";
import { Badge, Button, Card, CardContent, CardHeader, Input, Select, Switch } from "@dem-ui/base";
import { Modal, Tabs, TabsContent, TabsList, TabsTrigger } from "@dem-ui/functional";
import { themes } from "@dem-ui/themes";
import tokens from "@dem-ui/foundation/tokens";
import { FontAlternativesPage } from "./FontAlternatives";

function Specimen() {
  const [on, setOn] = useState(true);
  const [value, setValue] = useState("one");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline" onClick={() => setOpen(true)}>Dialog</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">Status</Badge>
        <Badge variant="success" ping>Active</Badge>
        <Badge variant="danger">Rev 1.04</Badge>
      </div>
      <Input label="Field" placeholder="Type here" />
      <Select
        label="Select"
        value={value}
        onChange={setValue}
        options={[
          { value: "one", label: "Option one" },
          { value: "two", label: "Option two" },
        ]}
      />
      <Switch label="Switch" checked={on} onChange={setOn} />
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab one</TabsTrigger>
          <TabsTrigger value="b">Tab two</TabsTrigger>
        </TabsList>
        <TabsContent value="a">First panel.</TabsContent>
        <TabsContent value="b">Second panel.</TabsContent>
      </Tabs>
      <Card>
        <CardHeader title="Card title" subtitle="Subtitle" />
        <CardContent>Card content.</CardContent>
      </Card>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Header>Dialog</Modal.Header>
        <Modal.Body>The portal keeps the theme of this column.</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export const Comparison: StoryObj = {
  name: "All themes side by side",
  parameters: { layout: "fullscreen" },
  render: (_, context) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(themes).map(([name, theme]) => (
        <UIProvider key={name} theme={theme} mode={context.globals.mode as ThemeMode}>
          <section className="ui-page min-w-0 p-6">
            <h2 className="mb-1 font-display text-3xl text-foreground [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking)">
              {theme.meta?.label}
            </h2>
            <p className="mb-6 text-sm text-foreground-muted">{theme.meta?.description}</p>
            <Specimen />
          </section>
        </UIProvider>
      ))}
    </div>
  ),
};

const ICONS: IconName[] = ["alert", "arrowDown", "arrowLeft", "arrowRight", "arrowUp", "check", "checkCircle", "chevronDown", "chevronLeft", "chevronRight", "close", "columns", "fileText", "filter", "globe", "palette", "image", "imageAdd", "info", "layout", "menu", "placeholder", "plus", "quote", "save", "search", "sort", "spinner", "trash", "type"];

export const Icons: StoryObj = {
  name: "Icon sets",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col">
      {Object.entries(themes).map(([name, theme]) => (
        <UIProvider key={name} theme={theme}>
          <section className="ui-page p-4 text-foreground">
            <h2 className="mb-3 font-display text-xl">{theme.meta?.label}</h2>
            <div className="flex flex-wrap gap-4">
              {ICONS.map((icon) => (
                <span key={icon} title={icon}>
                  <Icon name={icon} className="h-6 w-6" />
                </span>
              ))}
            </div>
          </section>
        </UIProvider>
      ))}
    </div>
  ),
};

export const Tokens: StoryObj = {
  name: "Active theme tokens",
  render: () => (
    <div className="flex flex-col gap-8 text-foreground">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {tokens.colors.map((token) => (
          <div key={token}>
            <div className="h-14 border border-border" style={{ background: `var(--ui-${token})` }} />
            <code className="mt-1 block font-mono text-xs break-all">--ui-{token}</code>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {tokens.other.map((token) => (
          <code key={token} className="font-mono text-xs break-all">--ui-{token}</code>
        ))}
      </div>
    </div>
  ),
};

export const Overrides: StoryObj = {
  name: "Overriding a theme",
  render: (_, context) => (
    <UIProvider
      overrides={{
        tokens: { primary: "#0f766e", "on-primary": "#ffffff", "radius-control": "9999px" },
        recipes: { button: { variants: { variant: { brand: "bg-fuchsia-600 text-white hover:bg-fuchsia-700" } } } },
        icons: { save: (props) => <span {...(props as object)}>★</span> },
      }}
    >
      <div className="flex max-w-md flex-col gap-4">
        <p className="text-sm text-foreground">
          The theme selected in the toolbar ({String(context.globals.theme)}), with a different primary colour, a round control radius, a new variant and one icon replaced.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline" icon={<Icon name="save" />}>Save</Button>
        </div>
        <Input label="Field" placeholder="Round too" />
      </div>
    </UIProvider>
  ),
};

export const FontAlternatives: StoryObj = {
  name: "Font alternatives",
  parameters: { layout: "fullscreen" },
  render: (_, context) => <FontAlternativesPage mode={context.globals.mode as ThemeMode} />,
};

const meta: Meta = { title: "Themes" };
export default meta;
