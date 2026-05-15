"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import type {
  Capability,
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
  saveLogicalComponent,
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
  const { logicalComponents, capabilitiesById } = useArchitectureData();
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
        <FlowsList
          capabilityId={capabilityId}
          components={components}
          flows={flows}
          allComponents={logicalComponents}
          capabilitiesById={capabilitiesById}
        />
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
        {components.map((c) => (
          <ComponentRow key={c.id} component={c} onRemoved={removeCtx} />
        ))}
      </ul>
      <AddComponentForm capabilityId={capabilityId} onAdded={addCtx} />
    </div>
  );
}

function ComponentRow({
  component,
  onRemoved,
}: {
  component: LogicalComponent;
  onRemoved: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const m = logicalNodeKindMeta[component.kind];

  if (editing) {
    return (
      <li className="rounded-lg bg-ink-50 ring-1 ring-ink-200 p-2">
        <EditComponentForm
          component={component}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: m.ring }}
      />
      <span
        className="text-[10px] uppercase tracking-wider font-semibold w-20 shrink-0"
        style={{ color: m.color }}
      >
        {m.label}
      </span>
      <span className="text-ink-900 font-medium flex-1 truncate">
        {component.name}
      </span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Edit component"
        className="w-5 h-5 rounded grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-ink-900 hover:bg-ink-100"
      >
        <Pencil size={11} />
      </button>
      <RemoveComponentButton id={component.id} onRemoved={onRemoved} />
    </li>
  );
}

function EditComponentForm({
  component,
  onDone,
}: {
  component: LogicalComponent;
  onDone: () => void;
}) {
  const { updateLogicalComponent: updateCtx } = useArchitectureData();
  const [name, setName] = useState(component.name);
  const [kind, setKind] = useState<LogicalComponentKind>(component.kind);
  const [description, setDescription] = useState(component.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const trimmedName = name.trim();
  const dirty =
    trimmedName !== component.name ||
    kind !== component.kind ||
    description.trim() !== (component.description ?? "");

  const submit = () => {
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await saveLogicalComponent(component.id, {
        name: trimmedName,
        kind,
        description,
      });
      if (result.ok) {
        updateCtx(result.component);
        onDone();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && dirty) submit();
          if (e.key === "Escape") onDone();
        }}
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
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Description (optional)"
        disabled={pending}
        className="w-full text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none resize-none"
      />
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
            onClick={onDone}
            disabled={pending}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || !dirty}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300"
          >
            {pending ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Pencil size={11} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FlowsList({
  capabilityId,
  components,
  flows,
  allComponents,
  capabilitiesById,
}: {
  capabilityId: string;
  components: LogicalComponent[];
  flows: LogicalFlow[];
  allComponents: LogicalComponent[];
  capabilitiesById: Record<string, Capability>;
}) {
  const { addLogicalFlow: addCtx, removeLogicalFlow: removeCtx } =
    useArchitectureData();
  const componentIds = new Set(components.map((c) => c.id));
  const internal = flows.filter(
    (f) => componentIds.has(f.from) && componentIds.has(f.to),
  );
  const crossOut = flows.filter(
    (f) => componentIds.has(f.from) && !componentIds.has(f.to),
  );
  const crossIn = flows.filter(
    (f) => componentIds.has(f.to) && !componentIds.has(f.from),
  );
  const cross = [...crossOut, ...crossIn];
  const allById = Object.fromEntries(allComponents.map((c) => [c.id, c]));

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
          Internal flows ({internal.length})
        </h4>
        <ul className="mt-2 space-y-1.5">
          {internal.length === 0 && (
            <li className="text-[11px] text-ink-400 italic">
              No flows yet — add one below.
            </li>
          )}
          {internal.map((f, i) => (
            <FlowRow
              key={`int-${f.from}-${f.to}-${f.kind}-${i}`}
              flow={f}
              fromName={allById[f.from]?.name ?? "?"}
              toName={allById[f.to]?.name ?? "?"}
              onRemoved={removeCtx}
            />
          ))}
        </ul>
      </div>

      {cross.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
            Cross-capability flows ({cross.length})
          </h4>
          <ul className="mt-2 space-y-1.5">
            {cross.map((f, i) => {
              const fromCap = allById[f.from]
                ? capabilitiesById[allById[f.from].capabilityId]
                : null;
              const toCap = allById[f.to]
                ? capabilitiesById[allById[f.to].capabilityId]
                : null;
              return (
                <FlowRow
                  key={`cross-${f.from}-${f.to}-${f.kind}-${i}`}
                  flow={f}
                  fromName={allById[f.from]?.name ?? "?"}
                  fromCap={fromCap?.name}
                  toName={allById[f.to]?.name ?? "?"}
                  toCap={toCap?.name}
                  onRemoved={removeCtx}
                />
              );
            })}
          </ul>
        </div>
      )}

      {components.length >= 1 ? (
        <AddFlowForm
          components={components}
          allComponents={allComponents}
          capabilitiesById={capabilitiesById}
          currentCapabilityId={capabilityId}
          onAdded={addCtx}
        />
      ) : (
        <p className="text-[11px] text-ink-400 italic">
          Add at least one component to create a flow.
        </p>
      )}
    </div>
  );
}

function FlowRow({
  flow,
  fromName,
  fromCap,
  toName,
  toCap,
  onRemoved,
}: {
  flow: LogicalFlow;
  fromName: string;
  fromCap?: string;
  toName: string;
  toCap?: string;
  onRemoved: (from: string, to: string, kind: string) => void;
}) {
  return (
    <li className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group">
      <NameWithCap name={fromName} cap={fromCap} />
      <span className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
        {flow.kind}
      </span>
      <NameWithCap name={toName} cap={toCap} />
      <span className="ml-auto" />
      <RemoveFlowButton
        from={flow.from}
        to={flow.to}
        kind={flow.kind}
        onRemoved={onRemoved}
      />
    </li>
  );
}

function NameWithCap({ name, cap }: { name: string; cap?: string }) {
  return (
    <span className="inline-flex flex-col leading-tight max-w-[40%]">
      {cap && (
        <span className="text-[9px] uppercase tracking-wider text-ink-400 truncate">
          {cap}
        </span>
      )}
      <span className="text-ink-900 font-medium truncate">{name}</span>
    </span>
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
  allComponents,
  capabilitiesById,
  currentCapabilityId,
  onAdded,
}: {
  components: LogicalComponent[];
  allComponents: LogicalComponent[];
  capabilitiesById: Record<string, Capability>;
  currentCapabilityId: string;
  onAdded: (f: LogicalFlow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [crossCapability, setCrossCapability] = useState(false);
  const [direction, setDirection] = useState<"outgoing" | "incoming">("outgoing");
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

  // For cross-capability flows, group the picker by capability (optgroup).
  const otherComponents = allComponents.filter(
    (c) => c.capabilityId !== currentCapabilityId,
  );
  const otherByCap: Record<string, LogicalComponent[]> = {};
  for (const c of otherComponents) {
    (otherByCap[c.capabilityId] ??= []).push(c);
  }

  // When cross is on:
  // - outgoing: from = this capability's component, to = another capability's
  // - incoming: from = another capability's component, to = this capability's
  const fromOptions = crossCapability && direction === "incoming"
    ? otherComponents
    : components;
  const toOptions = crossCapability && direction === "outgoing"
    ? otherComponents
    : components;
  const fromGrouped = crossCapability && direction === "incoming";
  const toGrouped = crossCapability && direction === "outgoing";

  return (
    <div className="p-2.5 rounded-lg bg-white ring-1 ring-ink-300 space-y-2">
      <label className="flex items-center gap-2 text-[11px] font-medium text-ink-600">
        <input
          type="checkbox"
          checked={crossCapability}
          onChange={(e) => {
            setCrossCapability(e.target.checked);
            setFrom("");
            setTo("");
          }}
          disabled={pending}
        />
        Cross-capability flow
      </label>
      {crossCapability && (
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-ink-500">Direction:</span>
          <button
            type="button"
            onClick={() => {
              setDirection("outgoing");
              setFrom("");
              setTo("");
            }}
            className={[
              "px-2 py-0.5 rounded font-medium",
              direction === "outgoing"
                ? "bg-ink-900 text-white"
                : "bg-ink-100 text-ink-600",
            ].join(" ")}
          >
            Outgoing
          </button>
          <button
            type="button"
            onClick={() => {
              setDirection("incoming");
              setFrom("");
              setTo("");
            }}
            className={[
              "px-2 py-0.5 rounded font-medium",
              direction === "incoming"
                ? "bg-ink-900 text-white"
                : "bg-ink-100 text-ink-600",
            ].join(" ")}
          >
            Incoming
          </button>
        </div>
      )}
      <PickerSelect
        value={from}
        onChange={setFrom}
        placeholder="From…"
        options={fromOptions}
        grouped={fromGrouped}
        otherByCap={otherByCap}
        capabilitiesById={capabilitiesById}
        disabled={pending}
        autoFocus
      />
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
      <PickerSelect
        value={to}
        onChange={setTo}
        placeholder="To…"
        options={toOptions}
        grouped={toGrouped}
        otherByCap={otherByCap}
        capabilitiesById={capabilitiesById}
        disabled={pending}
      />
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

function PickerSelect({
  value,
  onChange,
  placeholder,
  options,
  grouped,
  otherByCap,
  capabilitiesById,
  disabled,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: LogicalComponent[];
  grouped: boolean;
  otherByCap: Record<string, LogicalComponent[]>;
  capabilitiesById: Record<string, Capability>;
  disabled: boolean;
  autoFocus?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      autoFocus={autoFocus}
      className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
    >
      <option value="">{placeholder}</option>
      {grouped
        ? Object.entries(otherByCap).map(([capId, comps]) => (
            <optgroup
              key={capId}
              label={capabilitiesById[capId]?.name ?? capId}
            >
              {comps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))
        : options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
    </select>
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
