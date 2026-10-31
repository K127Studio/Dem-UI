import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileText, LayoutDashboard, Settings, Sparkles, Users } from "lucide-react";
import { GranularBgColorPicker, GranularColorPicker } from "@dem-ui/functional";
import { AdminShell, ComingSoonPlaceholder, FormActions, FormCard, FormErrorDialog, FormGroupHeading, FormNote, FormSectionHeading, LocaleTabs, LoginForm, SavingOverlay, TabHeading, ToggleRow } from "@dem-ui/ui";
import { Badge, Button, Input } from "@dem-ui/base";

export const FormPieces: StoryObj = {
  name: "Form pieces",
  render: function Render() {
    const [active, setActive] = useState(true);
    const [locale, setLocale] = useState("en");
    const [error, setError] = useState<string>();
    const [saving, setSaving] = useState(false);
    return (
      <div className="flex max-w-2xl flex-col gap-6">
        <FormCard>
          <FormSectionHeading icon={Sparkles} title="General" subtitle="The main fields" />
          <div className="flex flex-col gap-4">
            <LocaleTabs
              value={locale}
              onChange={setLocale}
              locales={[
                { code: "en", label: "English", translated: true },
                { code: "it", label: "Italiano", translated: false },
                { code: "kh", label: "Khmer", translated: false },
              ]}
            />
            <FormGroupHeading>Group of fields</FormGroupHeading>
            <Input label="Title" placeholder="Title" />
            <ToggleRow title="Published" description="Visible on the site" checked={active} onChange={setActive} />
            <FormNote>An explanatory note.</FormNote>
            <FormNote tone="warning">A warning note.</FormNote>
            <FormNote tone="danger">A danger note.</FormNote>
          </div>
        </FormCard>
        <FormActions
          backHref="#list"
          onSave={() => {
            setSaving(true);
            setTimeout(() => setSaving(false), 1000);
          }}
          isSaving={saving}
        >
          <Button variant="outline" onClick={() => setError("The save failed: this is the error dialog.")}>
            Simulate error
          </Button>
        </FormActions>
        <SavingOverlay isVisible={saving} />
        <FormErrorDialog error={error} onClose={() => setError(undefined)} />
      </div>
    );
  },
};

export const Heading: StoryObj<typeof TabHeading> = {
  name: "TabHeading",
  render: (args) => (
    <TabHeading {...args}>
      <Button variant="outline">Export</Button>
    </TabHeading>
  ),
  args: { title: "Articles", subtitle: "All the posts of the site", buttonLabel: "New article", buttonHref: "#new" },
};

export const Shell: StoryObj = {
  name: "AdminShell",
  render: () => (
    <AdminShell
      sidebar={{
        logo: "Dem UI",
        pathname: "/admin/posts/42",
        items: [
          { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
          { name: "Posts", href: "/admin/posts", icon: FileText },
          { name: "Users", href: "/admin/users", icon: Users },
          { name: "Settings", href: "/admin/settings", icon: Settings },
        ],
        isActive: (item, pathname) => (item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)),
        footer: <Badge variant="success">v0.1.0</Badge>,
      }}
      header={{ title: "Posts", children: <Button size="sm" variant="ghost">Account</Button> }}
    >
      <div className="flex flex-col gap-6">
        <TabHeading title="Posts" subtitle="Page content goes here" buttonLabel="New post" buttonHref="#new" />
        <ComingSoonPlaceholder description="The sidebar turns into a drawer below the md breakpoint." />
      </div>
    </AdminShell>
  ),
  parameters: { layout: "fullscreen" },
};

export const Login: StoryObj = {
  name: "LoginForm",
  render: () => (
    <LoginForm
      title="Welcome back"
      subtitle="Any input is rejected in this story"
      onSubmit={() => new Promise((_, reject) => setTimeout(() => reject(new Error("Wrong email or password.")), 800))}
      footer="Footer slot"
    />
  ),
  parameters: { layout: "fullscreen" },
};

export const Placeholder: StoryObj<typeof ComingSoonPlaceholder> = {
  name: "ComingSoonPlaceholder",
  render: (args) => <ComingSoonPlaceholder {...args} />,
  args: { description: "This section is not ready yet." },
};

export const ColorPickers: StoryObj = {
  name: "GranularColorPicker / GranularBgColorPicker",
  render: function Render() {
    const [text, setText] = useState("text-blue-500/100 dark:text-white/100");
    const [bg, setBg] = useState("bg-linear-to-br from-primary/100 to-violet-500/60 dark:bg-none dark:bg-black/100");
    return (
      <div className="flex max-w-xl flex-col gap-6 text-foreground">
        <GranularColorPicker label="Text colour" value={text} onChange={setText} />
        <GranularBgColorPicker label="Background" value={bg} onChange={setBg} />
        <div className={`rounded-card p-8 text-center text-2xl font-bold ${text} ${bg}`}>Preview</div>
        <code className="font-mono text-xs break-all">{text} {bg}</code>
      </div>
    );
  },
};

const meta: Meta = { title: "UI/Admin" };
export default meta;
