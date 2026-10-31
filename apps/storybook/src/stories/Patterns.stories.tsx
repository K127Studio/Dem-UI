import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { AdminListToolbar, ConfirmModal, DataTable, DeleteButton, FilterButton, ImageDropzone, ListToolbar, LocaleSwitch, Pagination, SearchSortFilter, formatBytes, type ColumnDef, type ConfirmTone, type FilterField, type FilterValues, type ImageOptimizationOptions, type OptimizedImage, type SortDirection } from "@dem-ui/functional";
import { Flag } from "@dem-ui/flags";
import { Badge, Button, Select } from "@dem-ui/base";
import { sampleImage } from "./samples";

export const ConfirmTones: StoryObj = {
  name: "ConfirmModal",
  render: function Render() {
    const [tone, setTone] = useState<ConfirmTone>();
    return (
      <>
        <div className="flex flex-wrap gap-3">
          {(["danger", "warning", "success", "info"] as const).map((value) => (
            <Button key={value} variant="outline" onClick={() => setTone(value)}>
              {value}
            </Button>
          ))}
        </div>
        <ConfirmModal
          isOpen={Boolean(tone)}
          tone={tone}
          onClose={() => setTone(undefined)}
          onConfirm={() => setTone(undefined)}
          title="Are you sure?"
          question="This is the question the dialog asks."
          detail="A line with more detail."
        />
      </>
    );
  },
};

export const Delete: StoryObj = {
  name: "DeleteButton",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <DeleteButton question="Delete this item?" onDelete={() => new Promise((resolve) => setTimeout(resolve, 800))} />
      <DeleteButton
        question="Delete with text?"
        buttonProps={{ variant: "danger" }}
        onDelete={() => new Promise((resolve) => setTimeout(resolve, 800))}
      >
        Delete
      </DeleteButton>
      <DeleteButton
        question="This one fails, and the dialog shows why."
        buttonProps={{ variant: "outline" }}
        onDelete={() => Promise.reject(new Error("The server refused."))}
      >
        Failing delete
      </DeleteButton>
      <DeleteButton
        question="A custom trigger."
        onDelete={() => {}}
        renderTrigger={(open) => (
          <button type="button" className="text-sm text-red-600 underline" onClick={open}>
            Custom trigger
          </button>
        )}
      />
    </div>
  ),
};

interface Person {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

const PEOPLE: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Admin", active: true },
  { id: "2", name: "Alan Turing", role: "Editor", active: true },
  { id: "3", name: "Grace Hopper", role: "Editor", active: false },
  { id: "4", name: "Linus Torvalds", role: "Viewer", active: true },
];

const COLUMNS: ColumnDef<Person>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role", sortable: true },
  {
    key: "active",
    header: "Status",
    align: "center",
    render: (person) => <Badge variant={person.active ? "success" : "neutral"}>{person.active ? "Active" : "Off"}</Badge>,
  },
];

export const Table: StoryObj = {
  name: "DataTable + ListToolbar + Pagination",
  render: function Render() {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [selected, setSelected] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState("name");
    const [direction, setDirection] = useState<SortDirection>("asc");
    const [page, setPage] = useState(1);

    const data = useMemo(() => {
      const filtered = PEOPLE.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) && (role === "all" || p.role === role),
      );
      const key = sortKey as "name" | "role";
      return [...filtered].sort((a, b) => a[key].localeCompare(b[key]) * (direction === "asc" ? 1 : -1));
    }, [search, role, sortKey, direction]);

    return (
      <div className="flex flex-col gap-4">
        <ListToolbar
          search={search}
          onSearchChange={setSearch}
          selectedCount={selected.length}
          massActions={[{ label: "Delete selected", variant: "danger", onClick: () => setSelected([]) }]}
          actions={<Button icon={<Plus className="h-4 w-4" />}>New</Button>}
        >
          <Select
            fullWidth={false}
            className="min-w-40"
            value={role}
            onChange={setRole}
            options={[
              { value: "all", label: "All roles" },
              { value: "Admin", label: "Admin" },
              { value: "Editor", label: "Editor" },
              { value: "Viewer", label: "Viewer" },
            ]}
          />
        </ListToolbar>
        <DataTable
          data={data}
          columns={COLUMNS}
          keyExtractor={(p) => p.id}
          selectedIds={selected}
          onSelectionChange={setSelected}
          sortKey={sortKey}
          sortDirection={direction}
          onSortChange={(key, dir) => {
            setSortKey(key);
            setDirection(dir);
          }}
          rowActions={(p) => (
            <>
              <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} icon={<Pencil className="h-4 w-4" />} />
              <DeleteButton question={`Delete ${p.name}?`} onDelete={() => {}} />
            </>
          )}
        />
        <Pagination page={page} pageCount={5} onPageChange={setPage} />
      </div>
    );
  },
};

export const TableStates: StoryObj = {
  name: "DataTable states",
  render: () => (
    <div className="flex flex-col gap-6">
      <DataTable data={[]} columns={COLUMNS} keyExtractor={(p: Person) => p.id} isLoading skeletonRows={3} caption="Loading" />
      <DataTable data={[]} columns={COLUMNS} keyExtractor={(p: Person) => p.id} emptyState="Nothing here yet." caption="Empty" />
      <DataTable data={PEOPLE} columns={COLUMNS} keyExtractor={(p) => p.id} density="compact" caption="Compact" />
    </div>
  ),
};

export const Dropzone: StoryObj = {
  name: "ImageDropzone",
  render: function Render() {
    const [value, setValue] = useState<string | null>(sampleImage);
    const [uploaded, setUploaded] = useState<string | null>(null);
    return (
      <div className="grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <ImageDropzone label="With an image" value={value} onChange={setValue} onFileSelect={() => {}} />
        <ImageDropzone
          label="Simulated upload, 2 MB limit"
          hint="PNG or JPG"
          maxSizeMB={2}
          value={uploaded}
          onChange={setUploaded}
          onUpload={(file) =>
            new Promise((resolve) => setTimeout(() => resolve(URL.createObjectURL(file)), 1200))
          }
        />
        <ImageDropzone
          label="Failing upload"
          onUpload={() => Promise.reject(new Error("The storage refused the file."))}
        />
        <ImageDropzone label="Disabled" disabled />
      </div>
    );
  },
};

export const Optimizer: StoryObj<ImageOptimizationOptions> = {
  name: "ImageDropzone: compression and WebP",
  render: function Render(args) {
    const [result, setResult] = useState<OptimizedImage>();
    return (
      <div className="flex max-w-md flex-col gap-3 text-foreground">
        <ImageDropzone {...args} label="Drop a JPG or PNG" hint="Change the options in Controls" onFileSelect={() => {}} onOptimized={setResult} />
        {result && (
          <p className="text-sm">
            {result.file.name} ({result.file.type}): {formatBytes(result.originalBytes)} to {formatBytes(result.optimizedBytes)}
          </p>
        )}
      </div>
    );
  },
  args: { compressImage: true, compressionRate: 0.8, convertToWebp: true },
  argTypes: { compressionRate: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } } },
};

const LOCALES = [
  { code: "en", label: "English", flag: <Flag code="gb" /> },
  { code: "kh", label: "ខ្មែរ", flag: <Flag code="kh" /> },
  { code: "it", label: "Italiano", flag: <Flag code="it" /> },
  { code: "fr", label: "Français", flag: <Flag code="fr" /> },
];

export const Locale: StoryObj = {
  name: "LocaleSwitch",
  render: function Render() {
    const [locale, setLocale] = useState("en");
    return (
      <div className="flex flex-wrap items-center gap-4 text-foreground">
        <LocaleSwitch locales={LOCALES} value={locale} onChange={setLocale} />
        <LocaleSwitch locales={LOCALES} value={locale} onChange={setLocale} iconOnly />
        <span className="text-sm">Current: {locale}</span>
      </div>
    );
  },
};

const FILTERS: FilterField[] = [
  { type: "select", key: "category", label: "Category", options: [{ value: "all", label: "All" }, { value: "serif", label: "Serif" }, { value: "sans", label: "Sans" }] },
  { type: "multiselect", key: "license", label: "License", placeholder: "Any license", options: [{ value: "ofl", label: "OFL" }, { value: "mit", label: "MIT" }, { value: "paid", label: "Paid" }] },
  { type: "tags", key: "tags", label: "Tags", options: ["Bold", "Display", "Mono", "Script", "Retro"].map((tag) => ({ value: tag, label: tag })) },
  { type: "toggle", key: "curated", label: "Curated only", description: "Hand-picked items" },
];

const SORT = [
  { value: "new", label: "Newest" },
  { value: "name", label: "Name" },
];

export const PublicList: StoryObj = {
  name: "List: public (search, sort, filter, numbered)",
  render: function Render() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("new");
    const [filters, setFilters] = useState<FilterValues>({});
    const [page, setPage] = useState(5);
    return (
      <div className="flex flex-col gap-6 text-foreground">
        <SearchSortFilter search={search} onSearchChange={setSearch} sortOptions={SORT} sort={sort} onSortChange={setSort} filters={FILTERS} filterValues={filters} onFiltersChange={setFilters} />
        <pre className="overflow-x-auto bg-surface-muted p-3 font-mono text-xs">{JSON.stringify({ search, sort, filters, page })}</pre>
        <Pagination variant="numbered" page={page} pageCount={12} onPageChange={setPage} />
      </div>
    );
  },
};

export const AdminList: StoryObj = {
  name: "List: admin (toolbar, bulk actions, summary)",
  render: function Render() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("new");
    const [perPage, setPerPage] = useState("10");
    const [filters, setFilters] = useState<FilterValues>({});
    const [selecting, setSelecting] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    return (
      <div className="flex flex-col gap-4">
        <AdminListToolbar
          search={search}
          onSearchChange={setSearch}
          sortOptions={SORT}
          sort={sort}
          onSortChange={setSort}
          perPageOptions={["10", "20", "50"].map((value) => ({ value, label: value }))}
          perPage={perPage}
          onPerPageChange={setPerPage}
          filters={FILTERS}
          filterValues={filters}
          onFiltersChange={setFilters}
          isSelectionMode={selecting}
          selectedCount={selected.length}
          onToggleSelectionMode={() => {
            setSelecting((on) => !on);
            setSelected([]);
          }}
          massActions={[{ label: "Delete", variant: "danger", onClick: () => setSelected([]) }]}
          actions={<Button icon={<Plus className="h-4 w-4" />}>New</Button>}
        />
        <DataTable
          data={PEOPLE}
          columns={COLUMNS}
          keyExtractor={(p) => p.id}
          selectedIds={selecting ? selected : undefined}
          onSelectionChange={setSelected}
        />
        <Pagination variant="summary" page={page} totalCount={42} perPage={Number(perPage)} entityName="people" onPageChange={setPage} />
      </div>
    );
  },
};

export const FilterButtonStory: StoryObj = {
  name: "FilterButton",
  render: () => (
    <div className="flex gap-3">
      <FilterButton />
      <FilterButton activeCount={3} />
    </div>
  ),
};

const meta: Meta = { title: "Functional/Patterns" };
export default meta;
