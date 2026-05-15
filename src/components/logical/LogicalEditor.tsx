"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type {
  LogicalComponent,
  LogicalComponentKind,
  LogicalFlow,
  LogicalFlowKind,
} from "@/lib/types";
import { useArchitectureData } from "@/components/ArchitectureDataProvider";
import {
  addLogicalComponent,
  addLogicalFlow,
  removeLogicalComponent,
  removeLogicalFlow,
} from "@/app/actions/logical";
import { logicalNodeKindMeta } from "./LogicalNode";

const COMPONENT_KINDS: LogicalComponentKind[] = [
  "service",
  "platform",
  "datastore",
  "interface",
  "external",
  "policy",
];

const FLOW_KINDS: LogicalFlowKind[] = [
  "calls",
  "publishes",
  "consumes",
  "reads",
  "writes",
  "enforces",
];

export function LogicalEditor({
  capabilityId,
  components,
  flows,
}: {
  capabilityId: string;
  components: LogicalComponent[];
  flows: LogicalFlow[];
}) {
  return (
    <section className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5 space-y-5">
      <header>
        <h3 className="text-sm font-semibold text-ink-900">
          Edit this capability&rsquo;s logical model
        </h3>
        <p className="text-xs text-ink-500 mt-0.5">
          Add or remove components and the flows between them. Changes are
          reflected in the graph above immediately.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-6">
        <ComponentsList capabilityId={capabilityId} components={components} />
        <FlowsList capabilityId={capabilityId} components={components} flows={flows} />
      </div>
    </section>
  );
}

function ComponentsList({
  capabilityId,
  components,
}: {
  capabilityId: string;
  components: LogicalComponent[];
}) {
  const {
    addLogicalComponent: addCtx,
    removeLogicalComponent: removeCtx,
  } = useArchitectureData();

  return (
    <div className="space-y-2">
      <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
        Components ({components.length})
      </h4>
      <ul className="space-y-1.5">
        {components.length === 0 && (
          <li className="text-[11px] text-ink-400 italic">
            No components yet — add one below.
          </li>
        )}
        {components.map((c) => {
          const m = logicalNodeKindMeta[c.kind];
          return (
            <li
              key={c.id}
              className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: m.ring }}
              />
              <span className="text-[10px] uppercase tracking-wider font-semibold w-20 shrink-0" style={{ color: m.color }}>
                {m.label}
              </span>
              <span className="text-ink-900 font-medium flex-1 truncate">
                {c.name}
              </span>
              <RemoveComponentButton
                id={c.id}
                onRemoved={removeCtx}
              />
            </li>
          );
        })}
      </ul>
      <AddComponentForm
        capabilityId={capabilityId}
        onAdded={addCtx}
      />
    </div>
  );
}

function FlowsList({
  capabilityId,
  components,
  flows,
}: {
  capabilityId: string;
  components: LogicalComponent[];
  flows: LogicalFlow[];
}) {
  const { addLogicalFlow: addCtx, removeLogicalFlow: removeCtx } =
    useArchitectureData();
  const componentIds = new Set(components.map((c) => c.id));
  // Internal flows only — cross-capability flows are managed from the other
  // capability's editor.
  const internal = flows.filter(
    (f) => componentIds.has(f.from) && componentIds.has(f.to),
  );
  const byId = Object.fromEntries(components.map((c) => [c.id, c]));

  return (
    <div className="space-y-2">
      <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
        Internal flows ({internal.length})
      </h4>
      <ul className="space-y-1.5">
        {internal.length === 0 && (
          <li className="text-[11px] text-ink-400 italic">
            No flows yet — add one below.
          </li>
        )}
        {internal.map((f, i) => {
          const from = byId[f.from];
          const to = byId[f.to];
          if (!from || !to) return null;
          return (
            <li
              key={`${f.from}-${f.to}-${f.kind}-${i}`}
              className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group"
            >
              <span className="text-ink-900 font-medium truncate max-w-[40%]">
                {from.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                {f.kind}
              </span>
              <span className="text-ink-900 font-medium truncate max-w-[40%]">
                {to.name}
              </span>
              <span className="ml-auto" />
              <RemoveFlowButton
                from={f.from}
                to={f.to}
                kind={f.kind}
                onRemoved={removeCtx}
              />
            </li>
          );
        })}
      </ul>
      {components.length >= 2 ? (
        <AddFlowForm components={components} onAdded={addCtx} />
      ) : (
        <p className="text-[11px] text-ink-400 italic">
          Add at least two components to create a flow.
        </p>
      )}
    </div>
  );
}

function AddComponentForm({
  capabilityId,
  onAdded,
}: {
  capabilityId: string;
  onAdded: (c: LogicalComponent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<LogicalComponentKind>("service");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await addLogicalComponent({
        capabilityId,
        name: name.trim(),
        kind,
      });
      if (result.ok) {
        onAdded(result.component);
        setName("");
        setOpen(false);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-ink-200 text-xs font-medium text-ink-500 hover:text-ink-900 hover:border-ink-400 hover:bg-white"
      >
        <Plus size={11} />
        Add component
      </button>
    );
  }

  return (
    <div className="p-2.5 rounded-lg bg-white ring-1 ring-ink-300 space-y-2">
      <input
        type="text"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Component name"
        disabled={pending}
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      />
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value as LogicalComponentKind)}
        disabled={pending}
        className="w-full text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      >
        {COMPONENT_KINDS.map((k) => (
          <option key={k} value={k}>
            {logicalNodeKindMeta[k].label}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-[11px] text-signal-replace font-medium">
            {error}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || !name.trim()}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300"
          >
            {pending ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function RemoveComponentButton({
  id,
  onRemoved,
}: {
  id: string;
  onRemoved: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Remove component"
      onClick={() =>
        startTransition(async () => {
          const result = await removeLogicalComponent(id);
          if (result.ok) onRemoved(result.id);
        })
      }
      disabled={pending}
      className="w-5 h-5 rounded grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-signal-replace hover:bg-signal-replace/10 transition-all disabled:opacity-100"
    >
      {pending ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />}
    </button>
  );
}

function AddFlowForm({
  components,
  onAdded,
}: {
  components: LogicalComponent[];
  onAdded: (f: LogicalFlow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [kind, setKind] = useState<LogicalFlowKind>("calls");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!from || !to) {
      setError("Pick both ends.");
      return;
    }
    if (from === to) {
      setError("From and to must differ.");
      return;
    }
    startTransition(async () => {
      const result = await addLogicalFlow({ from, to, kind });
      if (result.ok) {
        onAdded(result.flow);
        setFrom("");
        setTo("");
        setOpen(false);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-ink-200 text-xs font-medium text-ink-500 hover:text-ink-900 hover:border-ink-400 hover:bg-white"
      >
        <Plus size={11} />
        Add flow
      </button>
    );
  }

  return (
    <div className="p-2.5 rounded-lg bg-white ring-1 ring-ink-300 space-y-2">
      <select
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        disabled={pending}
        autoFocus
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      >
        <option value="">From…</option>
        {components.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value as LogicalFlowKind)}
        disabled={pending}
        className="w-full text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      >
        {FLOW_KINDS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        disabled={pending}
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      >
        <option value="">To…</option>
        {components.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-[11px] text-signal-replace font-medium">
            {error}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || !from || !to}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300"
          >
            {pending ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function RemoveFlowButton({
  from,
  to,
  kind,
  onRemoved,
}: {
  from: string;
  to: string;
  kind: LogicalFlowKind;
  onRemoved: (from: string, to: string, kind: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Remove flow"
      onClick={() =>
        startTransition(async () => {
          const result = await removeLogicalFlow({ from, to, kind });
          if (result.ok)
            onRemoved(result.removed.from, result.removed.to, result.removed.kind);
        })
      }
      disabled={pending}
      className="w-5 h-5 rounded grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-signal-replace hover:bg-signal-replace/10 transition-all disabled:opacity-100"
    >
      {pending ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />}
    </button>
  );
}
