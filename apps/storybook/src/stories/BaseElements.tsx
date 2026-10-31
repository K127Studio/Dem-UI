import { useState } from "react";
import { Article, Aside, Audio, Box, Button, Checkbox, Container, DescriptionDetails, DescriptionList, DescriptionTerm, Details, Divider, Embed, Fieldset, Figure, Footer, Form, Header, Image, Input, Link, List, ListItem, Main, Meter, NativeSelect, Nav, Paragraph, Progress, Radio, RadioGroup, Range, Section, Table, TableBody, TableCell, TableFoot, TableHead, TableHeaderCell, TableRow, Textarea, Video } from "@dem-ui/base";
import { Row } from "./HtmlElements";
import { sampleImage, sampleImageWarm } from "./samples";

export function LinksPage() {
  return (
    <div className="flex flex-col">
      <Row name="Link"><Link href="#a">Default link</Link></Row>
      <Row name='variant="muted"'><Link href="#b" variant="muted">Muted link</Link></Row>
      <Row name='variant="inherit"'><span className="text-danger">Takes the colour <Link href="#c" variant="inherit">of its parent</Link></span></Row>
      <Row name='underline="hover"'><Link href="#d" underline="hover">Line on hover</Link></Row>
      <Row name='underline="none"'><Link href="#e" underline="none">No line</Link></Row>
      <Row name="isExternal"><Link href="https://example.com" isExternal>Opens a new tab</Link></Row>
      <Row name="isExternal showExternalIcon"><Link href="https://example.com" isExternal showExternalIcon>With the arrow</Link></Row>
    </div>
  );
}

export function ListsPage() {
  return (
    <div className="flex flex-col">
      <Row name="List"><List items={["First", "Second", "Third"]} /></Row>
      <Row name="isOrdered"><List isOrdered items={["First", "Second", "Third"]} /></Row>
      <Row name="isOrdered start isReversed"><List isOrdered start={3} isReversed items={["Three", "Two", "One"]} /></Row>
      {(["circle", "square", "alpha", "roman", "none"] as const).map((marker) => (
        <Row key={marker} name={`marker="${marker}"`}><List marker={marker} items={["First", "Second"]} /></Row>
      ))}
      <Row name='spacing="lg"'><List spacing="lg" items={["First", "Second"]} /></Row>
      <Row name='size="lg"'><List size="lg" items={["First", "Second"]} /></Row>
      <Row name="isInline"><List isInline spacing="md" items={["One", "Two", "Three"]} /></Row>
      <Row name="nested">
        <List>
          <ListItem>
            Parent
            <List marker="circle" items={["Child", "Child"]} />
          </ListItem>
          <ListItem>Parent</ListItem>
        </List>
      </Row>
      <Row name="DescriptionList">
        <DescriptionList>
          <div>
            <DescriptionTerm>Weight</DescriptionTerm>
            <DescriptionDetails>330 ml</DescriptionDetails>
          </div>
        </DescriptionList>
      </Row>
      <Row name="DescriptionList isInline items">
        <DescriptionList isInline items={[{ term: "Weight", description: "330 ml" }, { term: "Alcohol", description: "5%" }]} />
      </Row>
    </div>
  );
}

export function MediaPage() {
  return (
    <div className="flex flex-col">
      <Row name="Image"><Image src={sampleImage} alt="A blue gradient" width={240} height={160} /></Row>
      {(["square", "video", "portrait", "wide"] as const).map((aspect) => (
        <Row key={aspect} name={`aspect="${aspect}"`}><div className="max-w-60"><Image src={sampleImage} alt="" aspect={aspect} /></div></Row>
      ))}
      <Row name='roundness="card"'><Image src={sampleImageWarm} alt="" width={160} height={160} roundness="card" /></Row>
      <Row name='roundness="full"'><Image src={sampleImageWarm} alt="" width={120} height={120} roundness="full" /></Row>
      <Row name="Figure"><Figure caption="The caption of the figure" className="max-w-60"><Image src={sampleImage} alt="" aspect="video" /></Figure></Row>
      <Row name="Video"><div className="max-w-sm"><Video aria-label="No source in this story" /></div></Row>
      <Row name="Audio"><Audio aria-label="No source in this story" /></Row>
      <Row name="Embed"><div className="max-w-sm"><Embed title="An empty frame" srcDoc="<p style='font-family:sans-serif'>Frame content</p>" /></div></Row>
    </div>
  );
}

export function LayoutPage() {
  const block = "rounded-control bg-surface-muted p-3 text-sm text-foreground";
  return (
    <div className="flex flex-col">
      <Row name="Box"><Box className={block}>A div</Box></Row>
      <Row name='Box as="section"'><Box as="section" className={block}>Any tag</Box></Row>
      <Row name="Section"><Section className={block}>section</Section></Row>
      <Row name="Article"><Article className={block}>article</Article></Row>
      <Row name="Aside"><Aside className={block}>aside</Aside></Row>
      <Row name="Header"><Header className={block}>header</Header></Row>
      <Row name="Footer"><Footer className={block}>footer</Footer></Row>
      <Row name="Main"><Main className={block}>main</Main></Row>
      <Row name="Nav"><Nav aria-label="Example" className={block}>nav</Nav></Row>
      <Row name='Container size="sm"'><Container size="sm" className={block}>Centred at a readable width</Container></Row>
      <Row name="Divider"><Divider /></Row>
      <Row name='lineStyle="dashed"'><Divider lineStyle="dashed" /></Row>
      <Row name='lineStyle="dotted"'><Divider lineStyle="dotted" /></Row>
      <Row name='spacing="none"'><Divider spacing="none" /></Row>
      <Row name='orientation="vertical"'><div className="flex h-10 items-center">Left<Divider orientation="vertical" />Right</div></Row>
    </div>
  );
}

const ROWS = [["Lager", "330 ml", "5%"], ["Lite", "330 ml", "3.5%"], ["Stout", "500 ml", "6%"]];

function SampleTable(props: { isStriped?: boolean; isBordered?: boolean; isHoverable?: boolean; density?: "compact" | "normal" | "relaxed"; caption?: string }) {
  return (
    <Table {...props}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Size</TableHeaderCell>
          <TableHeaderCell align="right">Alcohol</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row[0]}>
            <TableHeaderCell scope="row">{row[0]}</TableHeaderCell>
            <TableCell>{row[1]}</TableCell>
            <TableCell align="right">{row[2]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableCell colSpan={3}>Three products</TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  );
}

export function TablesPage() {
  return (
    <div className="flex flex-col">
      <Row name="Table"><SampleTable /></Row>
      <Row name="caption"><SampleTable caption="The caption names the table" /></Row>
      <Row name="isStriped"><SampleTable isStriped /></Row>
      <Row name="isBordered"><SampleTable isBordered /></Row>
      <Row name="isHoverable"><SampleTable isHoverable /></Row>
      <Row name='density="compact"'><SampleTable density="compact" /></Row>
      <Row name='density="relaxed"'><SampleTable density="relaxed" /></Row>
    </div>
  );
}

export function FormsPage() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("a");
  const [group, setGroup] = useState("small");
  const [select, setSelect] = useState("");
  const [range, setRange] = useState(40);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<string>();
  const sizes = [
    { value: "small", label: "Small" },
    { value: "large", label: "Large", description: "With a description" },
    { value: "off", label: "Unavailable", disabled: true },
  ];
  return (
    <div className="flex flex-col">
      <Row name="Checkbox"><Checkbox label="Accept" checked={checked} onChange={setChecked} /></Row>
      <Row name="description"><Checkbox label="With help" description="A line of explanation" /></Row>
      <Row name="isIndeterminate"><Checkbox label="Some selected" isIndeterminate /></Row>
      <Row name="error"><Checkbox label="Required" error="You must accept." /></Row>
      <Row name="disabled"><Checkbox label="Disabled" disabled /></Row>
      <Row name="Radio">
        <div className="flex flex-col gap-2">
          <Radio name="single" value="a" label="Option A" checked={radio === "a"} onChange={setRadio} />
          <Radio name="single" value="b" label="Option B" checked={radio === "b"} onChange={setRadio} />
        </div>
      </Row>
      <Row name="RadioGroup"><RadioGroup label="Size" options={sizes} value={group} onChange={setGroup} /></Row>
      <Row name="RadioGroup isInline"><RadioGroup label="Size" isInline options={sizes} value={group} onChange={setGroup} /></Row>
      <Row name="RadioGroup error"><RadioGroup label="Size" options={sizes.slice(0, 2)} error="Choose a size." /></Row>
      <Row name="NativeSelect"><NativeSelect label="Country" placeholder="Choose..." value={select} onChange={setSelect} options={[{ value: "kh", label: "Cambodia" }, { value: "it", label: "Italy" }]} /></Row>
      <Row name="NativeSelect error"><NativeSelect label="Country" error="Choose a country." options={[{ value: "kh", label: "Cambodia" }]} /></Row>
      <Row name="Textarea"><Textarea label="Message" placeholder="Several lines" rows={3} /></Row>
      <Row name="Range"><Range label="Volume" min={0} max={100} unit="%" value={range} onChange={setRange} /></Row>
      <Row name="Progress"><Progress label="Uploading" value={range} showValue /></Row>
      <Row name="Progress, unknown end"><Progress label="Working" /></Row>
      <Row name="Meter"><Meter label="Disk" value={0.6} low={0.25} high={0.75} optimum={0.1} showValue /></Row>
      <Row name="Details"><Details summary="More information" isOpen={open} onToggle={setOpen}>The content that opens.</Details></Row>
      <Row name="Fieldset"><Fieldset legend="A group of fields"><Input label="Name" /></Fieldset></Row>
      <Row name="Fieldset isDisabled"><Fieldset legend="Disabled together" isDisabled><Input label="Name" /><div className="mt-2"><Checkbox label="Option" /></div></Fieldset></Row>
      <Row name="Form">
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
          }}
        >
          <Input label="Name" name="name" defaultValue="Ada" />
          <NativeSelect label="Size" name="size" options={[{ value: "s", label: "Small" }]} />
          <Checkbox label="Newsletter" name="newsletter" />
          <Button type="submit">Send</Button>
          {sent && <Paragraph isMono size="xs">{sent}</Paragraph>}
        </Form>
      </Row>
    </div>
  );
}
