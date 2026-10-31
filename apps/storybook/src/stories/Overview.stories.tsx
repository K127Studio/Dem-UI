import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { Mail, Sparkles } from "lucide-react";
import { FormCard, FormNote, FormSectionHeading, TabHeading, ToggleRow } from "@dem-ui/ui";
import { Markdown, ParagraphWithImage, Quote, SimpleHero } from "@dem-ui/content";
import { AccordionGroup, ConfirmModal, DataTable, ImageDropzone, ListToolbar, Modal, Pagination, Tabs, TabsContent, TabsList, TabsTrigger } from "@dem-ui/functional";
import { Badge, Button, Card, CardContent, CardHeader, Input, Paragraph, Select, Switch } from "@dem-ui/base";
import { sampleImage, sampleText } from "./samples";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-6">
      <h2 className="text-xs font-semibold tracking-widest text-foreground uppercase">{title}</h2>
      {children}
    </section>
  );
}

function KitchenSink() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("it");
  const [on, setOn] = useState(true);
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [page, setPage] = useState(2);
  const [search, setSearch] = useState("");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 p-6 text-foreground">
      <TabHeading title="Dem UI" subtitle="Everything on one page. Use the toolbar to switch theme and colour mode." />

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          {(["primary", "secondary", "accent", "danger", "success", "outline", "ghost", "link"] as const).map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
          <Button isLoading>Loading</Button>
          <Button icon={<Mail className="h-4 w-4" />}>Icon</Button>
        </div>
      </Section>

      <Section title="Fields">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input label="Input" value={name} onChange={setName} placeholder="Type here" description="Help text" />
          <Input label="With error" value="wrong" onChange={() => {}} error="Not valid." />
          <Select
            label="Select"
            value={country}
            onChange={setCountry}
            options={[
              { value: "it", label: "Italy" },
              { value: "kh", label: "Cambodia" },
            ]}
          />
        </div>
        <Switch label="Switch" description="With a description" checked={on} onChange={setOn} />
      </Section>

      <Section title="Badge and Card">
        <div className="flex flex-wrap gap-2">
          {(["neutral", "primary", "success", "warning", "danger", "outline"] as const).map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
          <Badge variant="success" ping>
            Live
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(["default", "outline", "elevated"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <CardHeader title={variant} subtitle="Card" />
              <CardContent>Content.</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Tabs and Accordion">
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">First</TabsTrigger>
            <TabsTrigger value="two">Second</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First panel.</TabsContent>
          <TabsContent value="two">Second panel.</TabsContent>
        </Tabs>
        <AccordionGroup
          defaultOpenIds={["a"]}
          items={[
            { id: "a", title: "First question", content: "First answer." },
            { id: "b", title: "Second question", content: "Second answer." },
          ]}
        />
      </Section>

      <Section title="Modal">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setModal(true)}>
            Modal
          </Button>
          <Button variant="danger" onClick={() => setConfirm(true)}>
            ConfirmModal
          </Button>
        </div>
        <Modal isOpen={modal} onClose={() => setModal(false)}>
          <Modal.Header>Modal</Modal.Header>
          <Modal.Body>Content.</Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <ConfirmModal
          isOpen={confirm}
          tone="danger"
          title="Delete"
          question="Delete this item?"
          onClose={() => setConfirm(false)}
          onConfirm={() => setConfirm(false)}
        />
      </Section>

      <Section title="List">
        <ListToolbar search={search} onSearchChange={setSearch} actions={<Button>New</Button>} />
        <DataTable
          keyExtractor={(row) => row.id}
          columns={[
            { key: "name", header: "Name" },
            { key: "state", header: "State", render: (row) => <Badge variant="success">{row.state}</Badge> },
          ]}
          data={[
            { id: "1", name: "First row", state: "Active" },
            { id: "2", name: "Second row", state: "Active" },
          ]}
        />
        <Pagination page={page} pageCount={5} onPageChange={setPage} />
        <div className="max-w-sm">
          <ImageDropzone label="ImageDropzone" hint="PNG or JPG" />
        </div>
      </Section>

      <Section title="Admin form">
        <FormCard>
          <FormSectionHeading icon={Sparkles} title="FormCard" subtitle="With its heading" />
          <div className="flex flex-col gap-4">
            <ToggleRow title="ToggleRow" description="A labelled switch" checked={on} onChange={setOn} />
            <FormNote>FormNote</FormNote>
          </div>
        </FormCard>
      </Section>

      <Section title="Content">
        <SimpleHero title="SimpleHero" subtitle="With a subtitle" imageSrc={sampleImage} classNames={{ root: "min-h-72" }} />
        <Paragraph size="lg">{sampleText}</Paragraph>
        <ParagraphWithImage imageSrc={sampleImage} imagePosition="right">
          {sampleText}
        </ParagraphWithImage>
        <Quote author="Author">A sentence worth quoting.</Quote>
        <Markdown content={"### Markdown\n\nWith **bold** and a [link](https://example.com)."} />
      </Section>
    </div>
  );
}

export const AllComponents: StoryObj = {
  name: "All components",
  render: () => <KitchenSink />,
  parameters: { layout: "fullscreen" },
};

const meta: Meta = { title: "Overview" };
export default meta;
