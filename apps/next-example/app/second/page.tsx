import { Button, Heading } from "@dem-ui/core";

export default function Second() {
  return (
    <main className="p-10">
      <Heading level={1} data-testid="second">Second page</Heading>
      <Button href="/">Back</Button>
    </main>
  );
}
