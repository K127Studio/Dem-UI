import { createContext, useContext, type ComponentType, type ReactNode } from "react";
import type { IconName } from "@dem-ui/foundation";
import { GranularBgColorPicker, GranularColorPicker, OpacitySlider } from "@dem-ui/functional";
import { ImageDropzone } from "@dem-ui/functional";
import type { ImageOptimizationOptions } from "@dem-ui/functional";
import { Button } from "@dem-ui/base";
import { Input } from "@dem-ui/base";
import { Select, type SelectOption } from "@dem-ui/base";
import { Switch } from "@dem-ui/base";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";
import type { ContentModule } from "../registry";

export interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind: "text" | "background";
}

function DefaultColorField({ label, value, onChange, kind }: ColorFieldProps) {
  const Picker = kind === "background" ? GranularBgColorPicker : GranularColorPicker;
  return <Picker label={label} value={value} onChange={onChange} />;
}

export interface EditorEnvironment {
  /** Stores a file and resolves to its URL. Without it images are typed in as URLs. */
  uploadImage?: (file: File) => Promise<string>;
  /** Choices of the font fields. Without them the fields are hidden. */
  fontOptions?: SelectOption[];
  /** Applied to every image field: `compressImage`, `compressionRate`, `convertToWebp`. */
  imageOptimization?: ImageOptimizationOptions;
  /** The project's colour picker. Defaults to the granular pickers. */
  ColorField?: ComponentType<ColorFieldProps>;
}

const EditorContext = createContext<EditorEnvironment>({});

export interface ModuleEditorProps {
  module: ContentModule;
  onChange: (props: Record<string, any>) => void;
}

const ALIGN = ["left", "center", "right"].map((value) => ({ value, label: value }));
const SIZES = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"].map((value) => ({ value, label: value }));
const WEIGHTS = ["normal", "medium", "bold"].map((value) => ({ value, label: value }));

function useFields({ module, onChange }: ModuleEditorProps) {
  const env = useContext(EditorContext);
  const s = useStyles("moduleEditor");
  const p = module.props;
  const set = (key: string) => (value: unknown) => onChange({ ...p, [key]: value });
  const ColorField = env.ColorField ?? DefaultColorField;

  return {
    p,
    s,
    set,
    text: (key: string, label: string, multiline = false, rows?: number) => (
      <Input label={label} as={multiline ? "textarea" : "input"} rows={rows} value={p[key] ?? ""} onChange={set(key)} />
    ),
    choice: (key: string, label: string, options: SelectOption[]) => (
      <Select label={label} options={options} value={p[key] ?? ""} onChange={set(key) as (v: string) => void} />
    ),
    color: (key: string, label: string) => (
      <ColorField label={label} kind={/bg/i.test(key) ? "background" : "text"} value={p[key] ?? ""} onChange={set(key)} />
    ),
    font: (key: string, label: string) =>
      env.fontOptions ? (
        <Select label={label} options={env.fontOptions} value={p[key] ?? ""} onChange={set(key) as (v: string) => void} />
      ) : null,
    image: (key = "imageSrc", label = "Image") =>
      env.uploadImage ? (
        <ImageDropzone label={label} value={p[key]} onUpload={env.uploadImage} onChange={(url) => set(key)(url ?? "")} {...env.imageOptimization} />
      ) : (
        <Input label={label} value={p[key] ?? ""} onChange={set(key)} placeholder="https://" />
      ),
  };
}

export function ParagraphEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  return (
    <div className={f.s("root")}>
      {f.text("children", "Text", true, 6)}
      <div className={f.s("row")}>
        {f.choice("size", "Size", SIZES)}
        {f.choice("weight", "Weight", WEIGHTS)}
        {f.choice("align", "Alignment", ALIGN)}
        {f.font("fontFamily", "Font")}
      </div>
      {f.color("colorClassName", "Text colour")}
    </div>
  );
}

export function ParagraphWithImageEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  return (
    <div className={f.s("root")}>
      {f.text("children", "Text", true, 6)}
      {f.image()}
      {f.text("imageAlt", "Image description")}
      <div className={f.s("row")}>
        {f.choice("imagePosition", "Image position", ["left", "right", "top", "bottom", "background"].map((value) => ({ value, label: value })))}
        {f.choice("imageAspectRatio", "Image ratio", ["square", "video", "portrait", "wide", "auto"].map((value) => ({ value, label: value })))}
        {f.choice("size", "Size", SIZES)}
        {f.choice("align", "Alignment", ALIGN)}
      </div>
      {f.color("colorClassName", "Text colour")}
    </div>
  );
}

export function QuoteEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  return (
    <div className={f.s("root")}>
      {f.text("children", "Quote", true)}
      <div className={f.s("row")}>
        {f.text("author", "Author")}
        {f.text("authorDates", "Dates")}
        {f.text("authorInfo", "Info")}
        {f.font("fontFamily", "Font")}
        {f.color("colorClassName", "Text colour")}
        {f.color("bgColorClassName", "Background")}
      </div>
    </div>
  );
}

export function MarkdownEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  return (
    <div className={f.s("root")}>
      {f.text("content", "Markdown", true, 10)}
      <div className={f.s("row")}>
        {f.choice("size", "Size", SIZES.slice(0, 5))}
        {f.choice("align", "Alignment", [...ALIGN, { value: "justify", label: "justify" }])}
      </div>
      {f.color("colorClassName", "Text colour")}
    </div>
  );
}

export function SimpleHeroEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  return (
    <div className={f.s("root")}>
      {f.text("title", "Title")}
      {f.text("subtitle", "Subtitle", true, 3)}
      {f.image()}
      <div className={f.s("row")}>
        {f.choice("align", "Alignment", ALIGN)}
        {f.choice("vAlign", "Vertical alignment", ["top", "center", "bottom"].map((value) => ({ value, label: value })))}
        {f.color("titleColorClassName", "Title colour")}
        {f.color("subtitleColorClassName", "Subtitle colour")}
        {f.font("titleFontFamily", "Title font")}
        {f.font("subtitleFontFamily", "Subtitle font")}
      </div>
    </div>
  );
}

export function GridHeroEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  return (
    <div className={f.s("root")}>
      {f.image()}
      {f.choice("imagePosition", "Image position", ["left", "right"].map((value) => ({ value, label: value })))}
      {f.text("topTitle", "Top title")}
      {f.text("topSubtitle", "Top subtitle", true, 3)}
      <div className={f.s("row")}>
        {f.color("topBgColorClassName", "Top background")}
        {f.color("topTitleColorClassName", "Top title colour")}
      </div>
      {f.text("bottomParagraph", "Bottom text", true)}
      {f.color("bottomBgColorClassName", "Bottom background")}
      <Switch label="Show a button" checked={Boolean(f.p.hasButton)} onChange={f.set("hasButton")} />
      {f.p.hasButton && (
        <div className={f.s("row")}>
          {f.text("buttonLabel", "Button text")}
          {f.text("buttonHref", "Button link")}
        </div>
      )}
    </div>
  );
}

export function SpacerEditor(props: ModuleEditorProps) {
  const f = useFields(props);
  const options = (values: [string, string][]) => values.map(([value, label]) => ({ value, label }));
  return (
    <div className={f.s("root")}>
      <div className={f.s("row")}>
        {f.choice("height", "Height", options([["xs", "Extra small (16px)"], ["sm", "Small (32px)"], ["md", "Medium (64px)"], ["lg", "Large (96px)"], ["xl", "Extra large (128px)"], ["2xl", "Huge (192px)"], ["10vh", "10vh"], ["20vh", "20vh"]]))}
        {f.choice("type", "Type", options([["spacer", "Empty space"], ["divider", "Horizontal line"]]))}
      </div>
      {f.p.type === "divider" && (
        <>
          {<GranularBgColorPicker label="Line colour" value={f.p.lineColorClassName ?? ""} onChange={f.set("lineColorClassName")} />}
          {f.choice("lineHeight", "Thickness", ["1", "2", "4", "8", "16", "24", "32"].map((value) => ({ value, label: `${value}px` })))}
          <OpacitySlider label="Line width" min={10} value={parseInt(f.p.lineWidth ?? "100", 10)} onChange={(width) => f.set("lineWidth")(`${width}%`)} />
          <OpacitySlider label="Line opacity" value={Math.round((f.p.opacity ?? 1) * 100)} onChange={(opacity) => f.set("opacity")(opacity / 100)} />
        </>
      )}
    </div>
  );
}

export interface ModuleDefinition {
  type: string;
  label: string;
  icon: ReactNode;
  defaultProps: Record<string, any>;
  Editor: ComponentType<ModuleEditorProps>;
}

const icon = (name: IconName) => <Icon name={name} className="h-4 w-4" />;

export const defaultModuleDefinitions: ModuleDefinition[] = [
  {
    type: "simpleHero",
    label: "Simple Hero",
    icon: icon("image"),
    defaultProps: { title: "", subtitle: "", imageSrc: "", imageAlt: "", align: "center", vAlign: "center" },
    Editor: SimpleHeroEditor,
  },
  {
    type: "gridHero",
    label: "Grid Hero",
    icon: icon("layout"),
    defaultProps: { imageSrc: "", imageAlt: "", imagePosition: "left", topTitle: "", topSubtitle: "", bottomParagraph: "", hasButton: false, buttonLabel: "", buttonHref: "/", buttonVariant: "primary" },
    Editor: GridHeroEditor,
  },
  {
    type: "paragraph",
    label: "Paragraph",
    icon: icon("type"),
    defaultProps: { children: "", as: "p", size: "md", weight: "normal", variant: "default", align: "left" },
    Editor: ParagraphEditor,
  },
  {
    type: "markdown",
    label: "Markdown",
    icon: icon("fileText"),
    defaultProps: { content: "", size: "md", align: "left" },
    Editor: MarkdownEditor,
  },
  {
    type: "paragraphWithImage",
    label: "Text + Image",
    icon: icon("columns"),
    defaultProps: { children: "", size: "md", align: "left", imageSrc: "", imageAlt: "", imagePosition: "left", imageAspectRatio: "video" },
    Editor: ParagraphWithImageEditor,
  },
  {
    type: "quote",
    label: "Quote",
    icon: icon("quote"),
    defaultProps: { children: "", author: "", authorDates: "", authorInfo: "" },
    Editor: QuoteEditor,
  },
  {
    type: "spacer",
    label: "Spacer / Line",
    icon: icon("layout"),
    defaultProps: { height: "md", type: "spacer", lineWidth: "100%", lineHeight: "1", opacity: 1 },
    Editor: SpacerEditor,
  },
];

const newId = () => `module-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export interface ModuleListEditorProps extends EditorEnvironment {
  modules: ContentModule[];
  onChange: (modules: ContentModule[]) => void;
  /** Which modules can be added: a subset of the defaults, plus any of the project's. */
  definitions?: ModuleDefinition[];
  emptyText?: ReactNode;
  className?: string;
}

/** The module stack of a post form: add, edit, reorder, remove. */
export function ModuleListEditor({
  modules,
  onChange,
  definitions = defaultModuleDefinitions,
  emptyText,
  className,
  uploadImage,
  fontOptions,
  ColorField,
  imageOptimization,
}: ModuleListEditorProps) {
  const { labels } = useUI();
  const s = useStyles("moduleEditor");
  const move = (index: number, delta: number) => {
    const next = [...modules];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <EditorContext.Provider value={{ uploadImage, fontOptions, ColorField, imageOptimization }}>
      <div className={s("list", className)}>
        {!modules.length && <div className={s("empty")}>{emptyText ?? labels.noData}</div>}
        {modules.map((module, index) => {
          const definition = definitions.find((d) => d.type === module.type);
          return (
            <div key={module.id ?? index} className={s("item")}>
              <div className={s("itemHeader")}>
                <span className={s("itemTitle")}>
                  {definition?.icon}
                  {definition?.label ?? module.type}
                </span>
                <span className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={labels.moveUp} disabled={index === 0} onClick={() => move(index, -1)} icon={<Icon name="arrowUp" className="h-4 w-4" />} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={labels.moveDown} disabled={index === modules.length - 1} onClick={() => move(index, 1)} icon={<Icon name="arrowDown" className="h-4 w-4" />} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={labels.remove} onClick={() => onChange(modules.filter((_, i) => i !== index))} icon={<Icon name="trash" className="h-4 w-4" />} />
                </span>
              </div>
              <div className={s("itemBody")}>
                {definition && (
                  <definition.Editor
                    module={module}
                    onChange={(props) => onChange(modules.map((m, i) => (i === index ? { ...m, props } : m)))}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div className={s("add")}>
          {definitions.map((definition) => (
            <Button
              key={definition.type}
              variant="outline"
              size="sm"
              icon={<Icon name="plus" className="h-4 w-4" />}
              onClick={() => onChange([...modules, { id: newId(), type: definition.type, props: { ...definition.defaultProps } }])}
            >
              {definition.label}
            </Button>
          ))}
        </div>
      </div>
    </EditorContext.Provider>
  );
}
