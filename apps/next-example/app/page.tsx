import { Badge, Button, Card, CardContent, CardHeader, Code, Container, Heading, Image, Link, List, Paragraph, Section, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@dem-ui/core";
import { GridHero, GridHeroPanel, ModuleRenderer, Quote } from "@dem-ui/core";
import { cn } from "@dem-ui/core/utils";
import { Interactive } from "./Interactive";

// A Server Component: no "use client", and everything below is rendered on the server.
export default function Page() {
  const post = [
    { id: "1", type: "paragraph", props: { children: "A paragraph rendered from stored JSON.", size: "lg" } },
    { id: "2", type: "spacer", props: { height: "sm", type: "divider" } },
    { id: "3", type: "markdown", props: { content: "## Markdown\n\nWith **bold** text." } },
  ];

  return (
    <Container className={cn("flex flex-col gap-10 py-10")}>
      <Section className="flex flex-col gap-4">
        <Heading level={1} data-testid="title">Dem UI on Next.js</Heading>
        <Paragraph isItalic>Server rendered, themed, with one provider and no wiring.</Paragraph>
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/second" data-testid="router-link">Router link</Button>
          <Link href="/second">Text link</Link>
          <Link href="https://example.com" isExternal showExternalIcon>External</Link>
          <Badge variant="success">Server</Badge>
        </div>
      </Section>

      <List isOrdered items={["Install", "Import", "Done"]} />
      <Image src="/sample.svg" alt="A sample shape" width={320} height={200} />
      <Code isBlock language="ts">{`const answer = 42;`}</Code>

      <Table isStriped caption="A static table">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell align="right">Size</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Lager</TableCell>
            <TableCell align="right">330 ml</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Card>
        <CardHeader title="A card" subtitle="From the server" />
        <CardContent>
          Rendered on the server.
        </CardContent>
      </Card>

      <GridHero imageSrc="/sample.svg" imageAlt="" classNames={{ root: "min-h-64" }}>
        <GridHeroPanel className="bg-surface-muted">Top panel</GridHeroPanel>
        <GridHeroPanel>Bottom panel</GridHeroPanel>
      </GridHero>

      <ModuleRenderer modules={post} />
      <Quote author="Dem UI">A quote from the server.</Quote>
      <Interactive />
    </Container>
  );
}
