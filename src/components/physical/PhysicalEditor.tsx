"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type {
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
          components={components}
          dependencies={dependencies}
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
        {components.map((c) => {
          const kindMeta = physicalKindMeta[c.kind];
          const hostMeta = physicalHostMeta[c.host];
          return (
            <li
              key={c.id}
              className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group"
            >
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
                {c.name}
              </span>
              <span
                className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shrink-0"
                style={{ color: hostMeta.tone, background: hostMeta.bg }}
              >
                {hostMeta.label}
              </span>
              <RemoveComponentButton id={c.id} onRemoved={removeCtx} />
            </li>
          );
        })}
      </ul>
      <AddComponentForm
        capabilityId={capabilityId}
        logicalForCapability={logicalForCapability}
        onAdded={addCtx}
      />
    </div>
  );
}

function DependenciesList({
  components,
  dependencies,
}: {
  components: PhysicalComponent[];
  dependencies: PhysicalDependency[];
}) {
  const {
    addPhysicalDependency: addCtx,
    removePhysicalDependency: removeCtx,
  } = useArchitectureData();
  const ids = new Set(components.map((c) => c.id));
  const internal = dependencies.filter(
    (d) => ids.has(d.from) && ids.has(d.to),
  );
  const byId = Object.fromEntries(components.map((c) => [c.id, c]));

  return (
    <div className="space-y-2">
      <h4 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
        Internal dependencies ({internal.length})
      </h4>
      <ul className="space-y-1.5">
        {internal.length === 0 && (
          <li className="text-[11px] text-ink-400 italic">
            No dependencies yet — add one below.
          </li>
        )}
        {internal.map((d, i) => {
          const from = byId[d.from];
          const to = byId[d.to];
          if (!from || !to) return null;
          return (
            <li
              key={`${d.from}-${d.to}-${d.kind}-${i}`}
              className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg bg-ink-50 group"
            >
              <span className="text-ink-900 font-medium truncate max-w-[40%]">
                {from.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                {d.kind}
              </span>
              <span className="text-ink-900 font-medium truncate max-w-[40%]">
                {to.name}
              </span>
              <span className="ml-auto" />
              <RemoveDependencyButton
                from={d.from}
                to={d.to}
                kind={d.kind}
                onRemoved={removeCtx}
              />
            </li>
          );
        })}
      </ul>
      {components.length >= 2 ? (
        <AddDependencyForm components={components} onAdded={addCtx} />
      ) : (
        <p className="text-[11px] text-ink-400 italic">
          Add at least two components to create a dependency.
        </p>
      )}
    </div>
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
  onAdded,
}: {
  components: PhysicalComponent[];
  onAdded: (d: PhysicalDependency) => void;
}) {
  const [open, setOpen] = useState(false);
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

  return (
    <div className="p-2.5 rounded-lg bg-white ring-1 ring-ink-300 space-y-2">
      <select
        autoFocus
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        disabled={pending}
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
