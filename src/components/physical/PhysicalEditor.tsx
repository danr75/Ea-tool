"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import type {
  Capability,
  LogicalComponent,
  PhysicalComponent,
  PhysicalDependency,
  PhysicalDependencyKind,
  PhysicalHost,
  PhysicalKind,
} from "@/lib/types";
import { useArchitectureData } from "@/components/ArchitectureDataProvider";
import {
  addPhysicalComponent,
  addPhysicalDependency,
  removePhysicalComponent,
  removePhysicalDependency,
  savePhysicalComponent,
} from "@/app/actions/physical";
import { physicalHostMeta, physicalKindMeta } from "./PhysicalNode";

const COMPONENT_KINDS: PhysicalKind[] = [
  "compute",
  "datastore",
  "platform",
  "saas-app",
  "gateway",
  "messaging",
  "security",
  "device",
];

const HOSTS: PhysicalHost[] = ["aws", "azure", "gcp", "saas", "on-prem", "edge"];

const DEP_KINDS: PhysicalDependencyKind[] = [
  "calls",
  "reads",
  "writes",
  "publishes",
  "consumes",
  "secures",
  "hosts",
];

export function PhysicalEditor({
  capabilityId,
  components,
  dependencies,
  logicalForCapability,
}: {
  capabilityId: string;
  components: PhysicalComponent[];
  dependencies: PhysicalDependency[];
  logicalForCapability: LogicalComponent[];
}) {
  const { physicalComponents, capabilitiesById } = useArchitectureData();
  return (
    <section className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5 space-y-5">
      <header>
        <h3 className="text-sm font-semibold text-ink-900">
          Edit this capability&rsquo;s physical footprint
        </h3>
        <p className="text-xs text-ink-500 mt-0.5">
          Add or remove products and the dependencies between them. Changes
          are reflected in the graph above immediately.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-6">
        <ComponentsList
          capabilityId={capabilityId}
          components={components}
          logicalForCapability={logicalForCapability}
        />
        <DependenciesList
          capabilityId={capabilityId}
          components={components}
          dependencies={dependencies}
          allComponents={physicalComponents}
          capabilitiesById={capabilitiesById}
        />
      </div>
    </section>
  );
}

function ComponentsList({
  capabilityId,
  components,
  logicalForCapability,
}: {
  capabilityId: string;
  components: PhysicalComponent[];
  logicalForCapability: LogicalComponent[];
}) {
  const { addPhysicalComponent: addCtx, removePhysicalComponent: removeCtx } =
    useArchitectureData();
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
          <ComponentRow
            key={c.id}
            component={c}
            logicalForCapability={logicalForCapability}
            onRemoved={removeCtx}
          />
        ))}
      </ul>
      <AddComponentForm
        capabilityId={capabilityId}
        logicalForCapability={logicalForCapability}
        onAdded={addCtx}
      />
    </div>
  );
}

function ComponentRow({
  component,
  logicalForCapability,
  onRemoved,
}: {
  component: PhysicalComponent;
  logicalForCapability: LogicalComponent[];
  onRemoved: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const kindMeta = physicalKindMeta[component.kind];
  const hostMeta = physicalHostMeta[component.host];

  if (editing) {
    return (
      <li className="rounded-lg bg-ink-50 ring-1 ring-ink-200 p-2">
        <EditComponentForm
          component={component}
          logicalForCapability={logicalForCapability}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: kindMeta.ring }}
      />
      <span
        className="text-[10px] uppercase tracking-wider font-semibold w-16 shrink-0"
        style={{ color: kindMeta.color }}
      >
        {kindMeta.label}
      </span>
      <span className="text-ink-900 font-medium flex-1 truncate">
        {component.name}
      </span>
      <span
        className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0"
        style={{ color: hostMeta.tone, background: hostMeta.bg }}
      >
        {hostMeta.label}
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
  logicalForCapability,
  onDone,
}: {
  component: PhysicalComponent;
  logicalForCapability: LogicalComponent[];
  onDone: () => void;
}) {
  const { updatePhysicalComponent: updateCtx } = useArchitectureData();
  const [name, setName] = useState(component.name);
  const [vendor, setVendor] = useState(component.vendor ?? "");
  const [kind, setKind] = useState<PhysicalKind>(component.kind);
  const [host, setHost] = useState<PhysicalHost>(component.host);
  const [description, setDescription] = useState(component.description ?? "");
  const [logicalComponentId, setLogicalComponentId] = useState(
    component.logicalComponentId ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const trimmedName = name.trim();
  const dirty =
    trimmedName !== component.name ||
    vendor.trim() !== (component.vendor ?? "") ||
    kind !== component.kind ||
    host !== component.host ||
    description.trim() !== (component.description ?? "") ||
    logicalComponentId !== (component.logicalComponentId ?? "");

  const submit = () => {
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await savePhysicalComponent(component.id, {
        name: trimmedName,
        vendor,
        kind,
        host,
        description,
        logicalComponentId: logicalComponentId || null,
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
      <input
        type="text"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        placeholder="Vendor (optional)"
        disabled={pending}
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      />
      <div className="grid grid-cols-2 gap-1.5">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as PhysicalKind)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          {COMPONENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {physicalKindMeta[k].label}
            </option>
          ))}
        </select>
        <select
          value={host}
          onChange={(e) => setHost(e.target.value as PhysicalHost)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          {HOSTS.map((h) => (
            <option key={h} value={h}>
              {physicalHostMeta[h].label}
            </option>
          ))}
        </select>
      </div>
      <select
        value={logicalComponentId}
        onChange={(e) => setLogicalComponentId(e.target.value)}
        disabled={pending}
        className="w-full text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      >
        <option value="">Implements logical component (optional)…</option>
        {logicalForCapability.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
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

function DependenciesList({
  capabilityId,
  components,
  dependencies,
  allComponents,
  capabilitiesById,
}: {
  capabilityId: string;
  components: PhysicalComponent[];
  dependencies: PhysicalDependency[];
  allComponents: PhysicalComponent[];
  capabilitiesById: Record<string, Capability>;
}) {
  const {
    addPhysicalDependency: addCtx,
    removePhysicalDependency: removeCtx,
  } = useArchitectureData();
  const ids = new Set(components.map((c) => c.id));
  const internal = dependencies.filter(
    (d) => ids.has(d.from) && ids.has(d.to),
  );
  const crossOut = dependencies.filter(
    (d) => ids.has(d.from) && !ids.has(d.to),
  );
  const crossIn = dependencies.filter(
    (d) => ids.has(d.to) && !ids.has(d.from),
  );
  const cross = [...crossOut, ...crossIn];
  const allById = Object.fromEntries(allComponents.map((c) => [c.id, c]));

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
          Internal dependencies ({internal.length})
        </h4>
        <ul className="mt-2 space-y-1.5">
          {internal.length === 0 && (
            <li className="text-[11px] text-ink-400 italic">
              No dependencies yet — add one below.
            </li>
          )}
          {internal.map((d, i) => (
            <DepRow
              key={`int-${d.from}-${d.to}-${d.kind}-${i}`}
              dep={d}
              fromName={allById[d.from]?.name ?? "?"}
              toName={allById[d.to]?.name ?? "?"}
              onRemoved={removeCtx}
            />
          ))}
        </ul>
      </div>

      {cross.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
            Cross-capability dependencies ({cross.length})
          </h4>
          <ul className="mt-2 space-y-1.5">
            {cross.map((d, i) => {
              const fromCap = allById[d.from]
                ? capabilitiesById[allById[d.from].capabilityId]
                : null;
              const toCap = allById[d.to]
                ? capabilitiesById[allById[d.to].capabilityId]
                : null;
              return (
                <DepRow
                  key={`cross-${d.from}-${d.to}-${d.kind}-${i}`}
                  dep={d}
                  fromName={allById[d.from]?.name ?? "?"}
                  fromCap={fromCap?.name}
                  toName={allById[d.to]?.name ?? "?"}
                  toCap={toCap?.name}
                  onRemoved={removeCtx}
                />
              );
            })}
          </ul>
        </div>
      )}

      {components.length >= 1 ? (
        <AddDependencyForm
          components={components}
          allComponents={allComponents}
          capabilitiesById={capabilitiesById}
          currentCapabilityId={capabilityId}
          onAdded={addCtx}
        />
      ) : (
        <p className="text-[11px] text-ink-400 italic">
          Add at least one component to create a dependency.
        </p>
      )}
    </div>
  );
}

function DepRow({
  dep,
  fromName,
  fromCap,
  toName,
  toCap,
  onRemoved,
}: {
  dep: PhysicalDependency;
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
        {dep.kind}
      </span>
      <NameWithCap name={toName} cap={toCap} />
      <span className="ml-auto" />
      <RemoveDependencyButton
        from={dep.from}
        to={dep.to}
        kind={dep.kind}
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
  logicalForCapability,
  onAdded,
}: {
  capabilityId: string;
  logicalForCapability: LogicalComponent[];
  onAdded: (c: PhysicalComponent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [kind, setKind] = useState<PhysicalKind>("saas-app");
  const [host, setHost] = useState<PhysicalHost>("saas");
  const [logicalComponentId, setLogicalComponentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await addPhysicalComponent({
        capabilityId,
        name: name.trim(),
        kind,
        host,
        vendor: vendor.trim() || undefined,
        logicalComponentId: logicalComponentId || undefined,
      });
      if (result.ok) {
        onAdded(result.component);
        setName("");
        setVendor("");
        setLogicalComponentId("");
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
        placeholder="Component name (e.g. Postgres on RDS)"
        disabled={pending}
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      />
      <input
        type="text"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        placeholder="Vendor (optional, e.g. Amazon)"
        disabled={pending}
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      />
      <div className="grid grid-cols-2 gap-1.5">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as PhysicalKind)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          {COMPONENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {physicalKindMeta[k].label}
            </option>
          ))}
        </select>
        <select
          value={host}
          onChange={(e) => setHost(e.target.value as PhysicalHost)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          {HOSTS.map((h) => (
            <option key={h} value={h}>
              {physicalHostMeta[h].label}
            </option>
          ))}
        </select>
      </div>
      {logicalForCapability.length > 0 && (
        <select
          value={logicalComponentId}
          onChange={(e) => setLogicalComponentId(e.target.value)}
          disabled={pending}
          className="w-full text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          <option value="">Implements logical component (optional)…</option>
          {logicalForCapability.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      )}
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
            {pending ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Plus size={11} />
            )}
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
          const result = await removePhysicalComponent(id);
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

function AddDependencyForm({
  components,
  allComponents,
  capabilitiesById,
  currentCapabilityId,
  onAdded,
}: {
  components: PhysicalComponent[];
  allComponents: PhysicalComponent[];
  capabilitiesById: Record<string, Capability>;
  currentCapabilityId: string;
  onAdded: (d: PhysicalDependency) => void;
}) {
  const [open, setOpen] = useState(false);
  const [crossCapability, setCrossCapability] = useState(false);
  const [direction, setDirection] = useState<"outgoing" | "incoming">("outgoing");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [kind, setKind] = useState<PhysicalDependencyKind>("calls");
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
      const result = await addPhysicalDependency({ from, to, kind });
      if (result.ok) {
        onAdded(result.dependency);
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
        Add dependency
      </button>
    );
  }

  const otherComponents = allComponents.filter(
    (c) => c.capabilityId !== currentCapabilityId,
  );
  const otherByCap: Record<string, PhysicalComponent[]> = {};
  for (const c of otherComponents) {
    (otherByCap[c.capabilityId] ??= []).push(c);
  }

  const fromOptions =
    crossCapability && direction === "incoming" ? otherComponents : components;
  const toOptions =
    crossCapability && direction === "outgoing" ? otherComponents : components;
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
        Cross-capability dependency
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
        onChange={(e) => setKind(e.target.value as PhysicalDependencyKind)}
        disabled={pending}
        className="w-full text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
      >
        {DEP_KINDS.map((k) => (
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
  options: PhysicalComponent[];
  grouped: boolean;
  otherByCap: Record<string, PhysicalComponent[]>;
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

function RemoveDependencyButton({
  from,
  to,
  kind,
  onRemoved,
}: {
  from: string;
  to: string;
  kind: PhysicalDependencyKind;
  onRemoved: (from: string, to: string, kind: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Remove dependency"
      onClick={() =>
        startTransition(async () => {
          const result = await removePhysicalDependency({ from, to, kind });
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
