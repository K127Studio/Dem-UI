import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { Button, Input } from "@dem-ui/base";
import { Accordion, AccordionGroup, Modal, Tabs, TabsContent, TabsList, TabsTrigger } from "@dem-ui/functional";

/* ---------- Modal ---------- */

export const ModalPlayground: StoryObj<typeof Modal> = {
  name: "Modal",
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>Modal title</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <p>Escape closes it, Tab stays inside, focus returns to the button.</p>
              <Input label="A field" placeholder="Focus test" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Save</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  args: { size: "md", mobile: "sheet", closeOnBackdrop: true, closeOnEscape: true },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "2xl", "4xl", "6xl", "full"] },
    mobile: { control: "inline-radio", options: ["sheet", "card"] },
    isOpen: { control: false },
    children: { control: false },
  },
};

/* ---------- Tabs ---------- */

function TabsSample(props: Partial<ComponentProps<typeof Tabs>>) {
  return (
    <Tabs defaultValue="one" {...props}>
      <TabsList>
        <TabsTrigger value="one">First</TabsTrigger>
        <TabsTrigger value="two">Second</TabsTrigger>
        <TabsTrigger value="three" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel.</TabsContent>
      <TabsContent value="two">Second panel. Arrow keys move between tabs.</TabsContent>
    </Tabs>
  );
}

export const TabsVariants: StoryObj = {
  name: "Tabs",
  render: () => (
    <div className="flex flex-col gap-8 text-foreground">
      <TabsSample variant="underline" />
      <TabsSample variant="pills" />
      <TabsSample variant="enclosed" />
      <TabsSample variant="pills" orientation="vertical" />
    </div>
  ),
};

/* ---------- Accordion ---------- */

const FAQ = [
  { id: "a", title: "First question", content: "First answer." },
  { id: "b", title: "Second question", content: "Second answer." },
  { id: "c", title: "Third question", content: "Third answer." },
];

export const AccordionVariants: StoryObj = {
  name: "Accordion",
  render: () => (
    <div className="flex max-w-xl flex-col gap-8">
      <Accordion title="On its own" defaultOpen>
        Uncontrolled, starts open.
      </Accordion>
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">One open at a time</p>
        <AccordionGroup items={FAQ} defaultOpenIds={["a"]} />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Several open</p>
        <AccordionGroup items={FAQ} multiple />
      </div>
    </div>
  ),
};

const meta: Meta = { title: "Functional/Disclosure" };
export default meta;
