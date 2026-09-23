import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Row = Record<string, any>;

export type FieldType = "text" | "textarea" | "number" | "boolean" | "date" | "datetime" | "select";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Load options from another table: [table, valueColumn, labelColumn] */
  lookup?: { table: string; value: string; label: string };
  defaultValue?: any;
};

export type Column = {
  name: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

type Props = {
  table: string;
  title: string;
  description?: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  columns: Column[];
  fields: Field[];
  canCreate?: boolean;
};

function useLookups(fields: Field[]) {
  const lookups = fields.filter((f) => f.lookup);
  return useQuery({
    queryKey: ["admin-lookups", lookups.map((f) => f.lookup!.table).join(",")],
    enabled: lookups.length > 0,
    queryFn: async () => {
      const out: Record<string, { value: string; label: string }[]> = {};
      for (const field of lookups) {
        const l = field.lookup!;
        const { data, error } = await supabase
          .from(l.table as any)
          .select(`${l.value},${l.label}`)
          .limit(500);
        if (error) throw error;
        out[field.name] = ((data ?? []) as Row[]).map((r) => ({
          value: String(r[l.value]),
          label: String(r[l.label] ?? r[l.value]),
        }));
      }
      return out;
    },
  });
}

function toInputValue(type: FieldType | undefined, value: any) {
  if (value === null || value === undefined) return "";
  if (type === "datetime") return String(value).slice(0, 16);
  if (type === "date") return String(value).slice(0, 10);
  return String(value);
}

export function CrudSection({
  table,
  title,
  description,
  select = "*",
  orderBy,
  columns,
  fields,
  canCreate = true,
}: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["admin", table];
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<Row[]> => {
      let q = supabase.from(table as any).select(select);
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q.limit(500);
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const { data: lookupOptions = {} } = useLookups(fields);

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload: Row = {};
      for (const field of fields) {
        let v = values[field.name];
        if (v === "") v = null;
        if (field.type === "number" && v !== null && v !== undefined) v = Number(v);
        if (field.type === "boolean") v = Boolean(v);
        if (field.type === "datetime" && v) v = new Date(v).toISOString();
        payload[field.name] = v;
      }
      if (editing?.id) {
        const { error } = await supabase
          .from(table as any)
          .update(payload as any)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as any).insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries();
      toast.success(editing ? "Saved changes." : "Created successfully.");
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save."),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase.from(table as any).delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries();
      toast.success("Deleted.");
      setDeleteRow(null);
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not delete."),
  });

  const labelMaps = useMemo(() => lookupOptions, [lookupOptions]);

  function startCreate() {
    const initial: Row = {};
    for (const f of fields) initial[f.name] = f.defaultValue ?? (f.type === "boolean" ? true : "");
    setForm(initial);
    setEditing(null);
    setOpen(true);
  }

  function startEdit(row: Row) {
    const initial: Row = {};
    for (const f of fields) initial[f.name] = toInputValue(f.type, row[f.name]);
    if (fields.some((f) => f.type === "boolean")) {
      for (const f of fields) if (f.type === "boolean") initial[f.name] = Boolean(row[f.name]);
    }
    setForm(initial);
    setEditing(row);
    setOpen(true);
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {canCreate && (
          <Button onClick={startCreate} className="rounded-full bg-brand-gradient">
            <Plus className="mr-1.5 h-4 w-4" /> Add new
          </Button>
        )}
      </div>

      {error ? (
        <p className="text-sm text-destructive">{(error as any)?.message ?? "Could not load."}</p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {columns.map((c) => (
                  <th key={c.name} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  {columns.map((c) => (
                    <td key={c.name} className="px-4 py-3">
                      {c.render
                        ? c.render(row)
                        : typeof row[c.name] === "boolean"
                          ? row[c.name]
                            ? "Yes"
                            : "No"
                          : (row[c.name] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => startEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={() => setDeleteRow(row)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title.toLowerCase()}` : `Add ${title.toLowerCase()}`}</DialogTitle>
            <DialogDescription>Fill in the details and save.</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(form);
            }}
          >
            {fields.map((field) => {
              const options = field.options ?? labelMaps[field.name] ?? [];
              return (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      value={form[field.name] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    />
                  ) : field.type === "boolean" ? (
                    <Switch
                      id={field.name}
                      checked={Boolean(form[field.name])}
                      onCheckedChange={(v) => setForm({ ...form, [field.name]: v })}
                    />
                  ) : field.type === "select" || field.lookup ? (
                    <select
                      id={field.name}
                      required={field.required}
                      value={form[field.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">— none —</option>
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                            ? "date"
                            : field.type === "datetime"
                              ? "datetime-local"
                              : "text"
                      }
                      value={form[field.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              );
            })}
            <DialogFooter>
              <Button type="submit" disabled={save.isPending} className="rounded-full bg-brand-gradient">
                {save.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteRow)} onOpenChange={(v) => !v && setDeleteRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRow && remove.mutate(deleteRow)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
