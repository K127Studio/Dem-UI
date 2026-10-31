"use client";

import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Option, Select, Tabs, TabsContent, TabsList, TabsTrigger } from "@dem-ui/core";

// The parts that need state are the only client code of the page.
export function Interactive() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("one");
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalHeader>A modal</ModalHeader>
        <ModalBody>Portalled, and still themed.</ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
      <Select
        label="Choose"
        value={value}
        onChange={setValue}
        options={[
          { value: "one", label: "One" },
          { value: "two", label: "Two" },
        ]}
      />
      <Select label="With Option children" value={value} onChange={setValue}>
        <Option value="one">One</Option>
        <Option value="two">Two</Option>
      </Select>
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">First</TabsTrigger>
          <TabsTrigger value="b">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="a">First panel</TabsContent>
        <TabsContent value="b">Second panel</TabsContent>
      </Tabs>
    </div>
  );
}
