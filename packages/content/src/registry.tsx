import type { ComponentType, ReactNode } from "react";
import { Button } from "@dem-ui/base";
import { GridHero, GridHeroPanel } from "./GridHero";
import { Markdown } from "./Markdown";
import { Paragraph } from "@dem-ui/base";
import { ParagraphWithImage } from "./ParagraphWithImage";
import { Quote } from "./Quote";
import { SimpleHero } from "./SimpleHero";
import { Spacer } from "./Spacer";

/** A module as it is stored: the shape the three projects already save in their databases. */
export interface ContentModule {
  id?: string;
  type: string;
  props: Record<string, any>;
}

export interface ModuleRenderContext {
  /** Turns a stored image reference into a URL. */
  resolveMedia: (url: string) => string;
  /** Maps a stored `fontFamily` id to its class. */
  fontClass: (id?: string) => string | undefined;
}

export interface ModuleRenderProps {
  props: Record<string, any>;
  context: ModuleRenderContext;
}

export type ModuleRenderer = ComponentType<ModuleRenderProps>;

function ParagraphModule({ props, context }: ModuleRenderProps) {
  const { children, fontFamily, ...rest } = props;
  return (
    <Paragraph {...rest} className={context.fontClass(fontFamily)}>
      {children}
    </Paragraph>
  );
}

function ParagraphWithImageModule({ props, context }: ModuleRenderProps) {
  // `imageUrl` and `image` are older names still present in saved posts.
  const { children, fontFamily, imageSrc, imageUrl, image, ...rest } = props;
  const source = imageSrc || imageUrl || image;
  return (
    <ParagraphWithImage
      {...rest}
      imageSrc={source ? context.resolveMedia(source) : undefined}
      className={context.fontClass(fontFamily)}
    >
      {children}
    </ParagraphWithImage>
  );
}

function QuoteModule({ props, context }: ModuleRenderProps) {
  const { children, fontFamily, ...rest } = props;
  return (
    <Quote {...rest} className={context.fontClass(fontFamily)}>
      {children}
    </Quote>
  );
}

function MarkdownModule({ props, context }: ModuleRenderProps) {
  const { fontFamily, ...rest } = props;
  return <Markdown {...rest} className={context.fontClass(fontFamily)} />;
}

function SimpleHeroModule({ props, context }: ModuleRenderProps) {
  const {
    imageSrc,
    titleColorClassName,
    subtitleColorClassName,
    titleFontFamily,
    subtitleFontFamily,
    ...rest
  } = props;
  return (
    <SimpleHero
      {...rest}
      imageSrc={imageSrc ? context.resolveMedia(imageSrc) : undefined}
      titleClassName={[titleColorClassName, context.fontClass(titleFontFamily)].filter(Boolean).join(" ")}
      subtitleClassName={[subtitleColorClassName, context.fontClass(subtitleFontFamily)].filter(Boolean).join(" ")}
    />
  );
}

function GridHeroModule({ props, context }: ModuleRenderProps) {
  const p = props;
  const classes = (...values: (string | undefined)[]) => values.filter(Boolean).join(" ");
  return (
    <GridHero
      imageSrc={p.imageSrc ? context.resolveMedia(p.imageSrc) : undefined}
      imageAlt={p.imageAlt}
      imagePosition={p.imagePosition}
    >
      <GridHeroPanel className={p.topBgColorClassName}>
        {p.topTitle && (
          <h2 className={classes("text-4xl font-bold whitespace-pre-line", p.topTitleColorClassName, context.fontClass(p.topTitleFontFamily))}>
            {p.topTitle}
          </h2>
        )}
        {p.topSubtitle && (
          <p className={classes("mt-4 text-lg whitespace-pre-line", p.topSubtitleColorClassName, context.fontClass(p.topSubtitleFontFamily))}>
            {p.topSubtitle}
          </p>
        )}
      </GridHeroPanel>
      {(p.bottomParagraph || p.hasButton) && (
        <GridHeroPanel className={p.bottomBgColorClassName}>
          {p.bottomParagraph && (
            <p className={classes("whitespace-pre-line", p.bottomParagraphColorClassName, context.fontClass(p.bottomFontFamily))}>
              {p.bottomParagraph}
            </p>
          )}
          {p.hasButton && (
            <div className="mt-6">
              <Button href={p.buttonHref} variant={p.buttonVariant}>
                {p.buttonLabel}
              </Button>
            </div>
          )}
        </GridHeroPanel>
      )}
    </GridHero>
  );
}

function SpacerModule({ props }: ModuleRenderProps) {
  const { lineColorClassName, lineColorClassNameDark, ...rest } = props;
  return <Spacer {...rest} lineColorClassName={[lineColorClassName, lineColorClassNameDark].filter(Boolean).join(" ") || undefined} />;
}

export const defaultModuleRenderers: Record<string, ModuleRenderer> = {
  paragraph: ParagraphModule,
  paragraphWithImage: ParagraphWithImageModule,
  quote: QuoteModule,
  markdown: MarkdownModule,
  simpleHero: SimpleHeroModule,
  gridHero: GridHeroModule,
  spacer: SpacerModule,
};

export interface ModuleRendererProps {
  modules: ContentModule[];
  /** Replaces a module or adds a new type, without forking the package. */
  overrides?: Record<string, ModuleRenderer>;
  /** Runs on every module's props first: variable replacement, locale, data migrations. */
  transformProps?: (module: ContentModule) => Record<string, any>;
  resolveMedia?: (url: string) => string;
  /** Stored `fontFamily` id to class, for instance `{ standard: "font-sans" }`. */
  fontClasses?: Record<string, string>;
  /** Wraps each module, for spacing or containers. */
  wrapModule?: (element: ReactNode, module: ContentModule, index: number) => ReactNode;
  /** Shown for a type with no renderer. By default it is skipped. */
  renderUnknown?: (module: ContentModule) => ReactNode;
}

export function ModuleRenderer({
  modules,
  overrides,
  transformProps,
  resolveMedia = (url) => url,
  fontClasses,
  wrapModule,
  renderUnknown,
}: ModuleRendererProps) {
  const context: ModuleRenderContext = {
    resolveMedia,
    fontClass: (id) => (id ? fontClasses?.[id] : undefined),
  };
  return (
    <>
      {modules.map((module, index) => {
        const key = module.id ?? index;
        const Renderer = overrides?.[module.type] ?? defaultModuleRenderers[module.type];
        if (!Renderer) return <div key={key} hidden={!renderUnknown}>{renderUnknown?.(module)}</div>;
        const element = <Renderer props={transformProps ? transformProps(module) : module.props} context={context} />;
        return <div key={key}>{wrapModule ? wrapModule(element, module, index) : element}</div>;
      })}
    </>
  );
}
