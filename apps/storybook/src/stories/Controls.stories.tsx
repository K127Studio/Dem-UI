import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { fn } from "storybook/test";
import { ArrowRight, Check, Mail, Search, Star } from "lucide-react";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, Input, Label, Option, Select, Switch } from "@dem-ui/base";
import { UIProvider, createRecipes } from "@dem-ui/foundation";

const row = "flex flex-wrap items-center gap-3";
const stack = "flex max-w-md flex-col gap-4";

/* ---------- Button ---------- */

export const ButtonPlayground: StoryObj<typeof Button> = {
  name: "Button",
  render: (args) => <Button {...args} />,
  args: { children: "Button", variant: "primary", size: "md", onClick: fn() },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "accent", "danger", "success", "outline", "ghost", "link", "glass"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "icon"] },
    roundness: { control: "select", options: ["none", "sm", "md", "lg", "xl", "2xl", "full"] },
    iconPosition: { control: "inline-radio", options: ["left", "right"] },
    icon: { control: false },
  },
};

export const ButtonVariants: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className={row}>
        {(["primary", "secondary", "accent", "danger", "success", "outline", "ghost", "link"] as const).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <div className={`${row} rounded-lg bg-neutral-800 p-4`}>
        <Button variant="glass">glass</Button>
      </div>
      <div className={row}>
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className={row}>
        {(["none", "sm", "md", "lg", "xl", "2xl", "full"] as const).map((roundness) => (
          <Button key={roundness} roundness={roundness} variant="secondary">
            {roundness}
          </Button>
        ))}
      </div>
      <div className={row}>
        <Button icon={<Mail className="h-4 w-4" />}>Icon left</Button>
        <Button icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
          Icon right
        </Button>
        <Button size="icon" aria-label="Favourite" icon={<Star className="h-4 w-4" />} />
        <Button isLoading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button href="#link" variant="outline">
          Link
        </Button>
        <Button href="https://example.com" isExternalLink variant="link">
          External link
        </Button>
      </div>
      <Button fullWidth>Full width</Button>
    </div>
  ),
};

const brandTheme = createRecipes({
  button: {
    slots: { root: "tracking-wide uppercase" },
    variants: { variant: { brand: "bg-fuchsia-600 text-white hover:bg-fuchsia-700" } },
  },
});

export const ButtonCustomVariant: StoryObj = {
  name: "Button: variant added by theme",
  render: () => (
    <UIProvider overrides={{ recipes: brandTheme }}>
      <div className={row}>
        <Button variant="brand">brand (from the theme)</Button>
        <Button variant="primary">primary, also restyled</Button>
        <Button classNames={{ root: "bg-black text-amber-300 hover:bg-neutral-800" }}>One-off classNames</Button>
      </div>
    </UIProvider>
  ),
};

/* ---------- Input ---------- */

function ControlledInput(props: ComponentProps<typeof Input>) {
  const [value, setValue] = useState(String(props.value ?? ""));
  return <Input {...props} value={value} onChange={setValue} />;
}

export const InputPlayground: StoryObj<typeof Input> = {
  name: "Input",
  render: (args) => (
    <div className="max-w-md">
      <ControlledInput {...args} />
    </div>
  ),
  args: { label: "Name", placeholder: "Type here", description: "Help text", size: "md", as: "input" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    roundness: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    as: { control: "inline-radio", options: ["input", "textarea"] },
    error: { control: "text" },
    leftIcon: { control: false },
    rightIcon: { control: false },
    labelIcon: { control: false },
  },
};

export const InputStates: StoryObj = {
  render: () => (
    <div className={stack}>
      <ControlledInput label="Required" required placeholder="Required field" />
      <ControlledInput label="Label icon" labelIcon={Mail} placeholder="With a label icon" />
      <ControlledInput label="Inline icons" leftIcon={<Search className="h-4 w-4" />} rightIcon={<Check className="h-4 w-4" />} />
      <ControlledInput label="With error" value="wrong" error="This value is not valid." />
      <ControlledInput label="Disabled" disabled value="Cannot change" />
      <ControlledInput label="Textarea" as="textarea" rows={3} placeholder="Several lines" />
      <ControlledInput size="sm" placeholder="Small, no label" aria-label="Small" />
      <ControlledInput size="lg" roundness="full" placeholder="Large and round" aria-label="Large" />
      <Label required icon={Star}>
        Label on its own
      </Label>
    </div>
  ),
};

/* ---------- Select ---------- */

const OPTIONS = [
  { value: "it", label: "Italy" },
  { value: "kh", label: "Cambodia" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan", disabled: true },
  { value: "us", label: "United States" },
];

export const SelectPlayground: StoryObj<typeof Select> = {
  name: "Select",
  render: function Render(args) {
    const [value, setValue] = useState("it");
    return (
      <div className="max-w-md">
        <Select {...(args as object)} options={OPTIONS} value={value} onChange={setValue} />
      </div>
    );
  },
  args: { label: "Country", size: "md", searchable: false, disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    roundness: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    error: { control: "text" },
    options: { control: false },
  },
};

export const SelectModes: StoryObj = {
  render: function Render() {
    const [single, setSingle] = useState("");
    const [multi, setMulti] = useState<string[]>(["it", "fr"]);
    const [compound, setCompound] = useState("b");
    const [search, setSearch] = useState("kh");
    return (
      <div className={stack}>
        <Select label="Options array" placeholder="Choose..." options={OPTIONS} value={single} onChange={setSingle} />
        <Select label="Multiple" multiple options={OPTIONS} value={multi} onChange={setMulti} />
        <Select label="Option children" value={compound} onChange={setCompound}>
          <Option value="a">Alpha</Option>
          <Option value="b" icon={<Star className="h-4 w-4" />}>
            Beta with icon
          </Option>
        </Select>
        <Select label="Searchable" searchable options={OPTIONS} value={search} onChange={setSearch} />
        <Select label="With error" error="Choose a value." options={OPTIONS} value="" onChange={() => {}} />
        <Select label="Disabled" disabled options={OPTIONS} value="it" onChange={() => {}} />
        <div className="overflow-hidden rounded-md border border-dashed border-border p-3">
          <Select label="Inside overflow-hidden: not clipped" options={OPTIONS} value={single} onChange={setSingle} />
        </div>
      </div>
    );
  },
};

/* ---------- Switch ---------- */

export const SwitchPlayground: StoryObj<typeof Switch> = {
  name: "Switch",
  render: function Render(args) {
    const [checked, setChecked] = useState(true);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: "Notifications", description: "Send me an email", size: "md", disabled: false },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
};

/* ---------- Badge ---------- */

export const BadgePlayground: StoryObj<typeof Badge> = {
  name: "Badge",
  render: (args) => <Badge {...args} />,
  args: { children: "Badge", variant: "primary", size: "sm", ping: false },
  argTypes: {
    variant: { control: "select", options: ["neutral", "primary", "success", "warning", "danger", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    roundness: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    icon: { control: false },
  },
};

export const BadgeVariants: StoryObj = {
  render: () => (
    <div className={row}>
      {(["neutral", "primary", "success", "warning", "danger", "outline"] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
      <Badge variant="success" ping>
        Live
      </Badge>
      <Badge variant="primary" icon={<Star className="h-3 w-3" />} size="md" roundness="none">
        Icon, square
      </Badge>
    </div>
  ),
};

/* ---------- Card ---------- */

export const CardVariants: StoryObj = {
  name: "Card",
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {(["default", "outline", "elevated", "glass", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader title={variant} subtitle="Card header" hasBorder actions={<Badge>New</Badge>} />
          <CardContent>Card content.</CardContent>
          <CardFooter hasBorder>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
      <Card interactive roundness="2xl" as="article">
        <CardContent>Interactive, rendered as article, with a large radius.</CardContent>
      </Card>
    </div>
  ),
};

const meta: Meta = { title: "Base/Controls" };
export default meta;
