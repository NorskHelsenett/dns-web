import { useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { cn } from "cn";
 
/* ------------------------------------------------------------------- */
/* Schema (local for now, swap for the API schema later)               */
/* Error messages are translation keys; <Field> translates them.       */
/* ------------------------------------------------------------------- */
 
const fqdn =
  /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
 
const E = "zones.form.errors";
 
const soaNumber = z
  .number({ message: `${E}.mustBeNumber` })
  .int(`${E}.mustBeWholeNumber`)
  .min(0, `${E}.mustBeNonNegative`);
 
const zoneSchema = z.object({
  name: z
    .string()
    .min(1, `${E}.required`)
    .regex(fqdn, `${E}.invalidDomain`),
  description: z.string().max(500, `${E}.descriptionTooLong`),
  accessGroups: z.array(z.string()).min(1, `${E}.pickGroup`),
  owner: z.string().nullable(),
  views: z
    .object({
      internet: z.boolean(),
      helsenett: z.boolean(),
      dataCenter: z.boolean(),
    })
    .refine((v) => v.internet || v.helsenett || v.dataCenter, `${E}.pickView`),
  status: z.enum(["active", "inactive"]),
  defaultTtl: z
    .number()
    .int()
    .min(1, `${E}.ttlTooSmall`)
    .max(2147483647, `${E}.ttlTooLarge`),
  soa: z.object({
    refresh: soaNumber,
    retry: soaNumber,
    expire: soaNumber,
    negativeTtl: soaNumber,
  }),
  nameServers: z.enum(["automatic", "manual"]),
  rpz: z.boolean(),
});
 
export type ZoneFormValues = z.infer<typeof zoneSchema>;
 
const defaultValues: ZoneFormValues = {
  name: "",
  description: "",
  accessGroups: ["Platform"],
  owner: null,
  views: { internet: true, helsenett: false, dataCenter: false },
  status: "active",
  defaultTtl: 43200,
  soa: { refresh: 3600, retry: 600, expire: 1209600, negativeTtl: 300 },
  nameServers: "automatic",
  rpz: false,
};
 
/* ------------------------------------------------------------------ */
/* Mock data (replace with real queries later)                         */
/* ------------------------------------------------------------------ */
 
const MOCK_GROUPS = ["Platform", "Network", "Security", "Support"];
const MOCK_OWNERS = [
  { id: "org-1", name: "Norsk Helsenett" },
  { id: "org-2", name: "Example Customer AS" },
];
const TTL_OPTIONS = [
  { key: "fiveMinutes", value: 300 },
  { key: "oneHour", value: 3600 },
  { key: "fourHours", value: 14400 },
  { key: "twelveHours", value: 43200 },
  { key: "oneDay", value: 86400 },
] as const;
 
/* ------------------------------------------------------------------ */
/* Shared Tailwind class strings                                       */
/* ------------------------------------------------------------------ */
 
const inputCls =
  "w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 " +
  "dark:border-neutral-700 dark:bg-neutral-900";
const readonlyCls = `${inputCls} bg-neutral-100 text-neutral-500 dark:bg-neutral-800`;
 
/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */
 
type Props = {
  availableGroups?: string[];
  owners?: { id: string; name: string }[];
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  onSubmit?: (values: ZoneFormValues) => void | Promise<void>;
  onCancel?: () => void;
};
 
export function ZoneForm({
  availableGroups = MOCK_GROUPS,
  owners = MOCK_OWNERS,
  isAdmin = true,
  isSuperAdmin = false,
  onSubmit = async (v) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("zone submitted", v);
  },
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const k = "zones.form";
  // UI-only: whether "Custom TTL" is selected. The form value stays in seconds.
  const [customTtl, setCustomTtl] = useState(false);
 
  const form = useForm({
    defaultValues,
    validators: { onChange: zoneSchema },
    onSubmit: async ({ value }) => onSubmit(value),
  });
 
  return (
    <form
      noValidate
      className="flex max-w-4xl flex-col rounded-lg border bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      {/* ---------- Zone ---------- */}
      <Section title={t(`${k}.zone.title`)} help={t(`${k}.zone.description`)}>
        <form.Field name="name">
          {(field) => (
            <Field
              label={t(`${k}.zone.field.zoneName.title`)}
              htmlFor="name"
              errors={field.state.meta.errors}
            >
              <input
                id="name"
                className={inputCls}
                value={field.state.value}
                placeholder={t(`${k}.zone.field.zoneName.placeholder`)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value.trim().toLowerCase())}
              />
            </Field>
          )}
        </form.Field>
 
        <form.Field name="description">
          {(field) => (
            <Field
              label={t(`${k}.zone.field.description.title`)}
              htmlFor="description"
              errors={field.state.meta.errors}
            >
              <textarea
                id="description"
                rows={3}
                className={`${inputCls} resize-y`}
                value={field.state.value}
                placeholder={t(`${k}.zone.field.description.placeholder`)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>
      </Section>
 
      {/* ---------- Access ---------- */}
      <Section
        title={t(`${k}.access.title`)}
        help={t(`${k}.access.description`)}
        className="border-t"
      >
        <form.Field name="accessGroups">
          {(field) => {
            const remaining = availableGroups.filter((g) => !field.state.value.includes(g));
            return (
              <Field
                label={t(`${k}.access.field.accessGroups.title`)}
                errors={field.state.meta.errors}
                hint={t(`${k}.access.field.accessGroups.description`)}
              >
                {field.state.value.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {field.state.value.map((g, i) => (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 rounded border border-neutral-300 py-0.5 pl-2.5 pr-1 text-sm dark:border-neutral-700"
                      >
                        {g}
                        <button
                          type="button"
                          aria-label={t(`${k}.access.field.accessGroups.remove`, { name: g })}
                          className="px-1 text-base leading-none hover:text-red-600"
                          onClick={() => field.removeValue(i)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <select
                  className={`${inputCls} w-auto min-w-52`}
                  value=""
                  aria-label={t(`${k}.access.field.accessGroups.selectLabel`)}
                  onChange={(e) => e.target.value && field.pushValue(e.target.value)}
                >
                  <option value="">{t(`${k}.access.field.accessGroups.selectLabel`)}</option>
                  {remaining.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </Field>
            );
          }}
        </form.Field>
 
        <form.Field name="owner">
          {(field) => (
            <Field
              label={t(`${k}.access.field.owner.title`)}
              htmlFor="owner"
              errors={field.state.meta.errors}
              hint={t(`${k}.access.field.owner.description`)}
            >
              <select
                id="owner"
                className={`${inputCls} w-auto min-w-52`}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value || null)}
              >
                <option value="">{t(`${k}.access.field.owner.selectLabel`)}</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </form.Field>
      </Section>
 
      {/* ---------- View ---------- */}
      <Section
        title={t(`${k}.view.title`)}
        help={t(`${k}.view.description`)}
        className="border-t"
      >
        <form.Field name="views">
          {(field) => (
            <Field errors={field.state.meta.errors}>
              {(
                [
                  ["internet", "internet", false],
                  ["helsenett", "helsenett", false],
                  ["dataCenter", "datacenter", true],
                ] as const
              ).map(([key, tKey, disabled]) => (
                <Choice
                  key={key}
                  type="checkbox"
                  label={t(`${k}.view.field.${tKey}.title`)}
                  description={t(`${k}.view.field.${tKey}.description`)}
                  disabled={disabled}
                  checked={field.state.value[key]}
                  onChange={(checked) => field.handleChange({ ...field.state.value, [key]: checked })}
                />
              ))}
            </Field>
          )}
        </form.Field>
      </Section>
 
      {/* ---------- Status and TTL ---------- */}
      <Section title={t(`${k}.statusAndTtl.title`)} className="border-t">
        <form.Field name="status">
          {(field) => (
            <Field label={t(`${k}.statusAndTtl.field.status.title`)}>
              <Choice
                type="radio"
                name="status"
                label={t(`${k}.statusAndTtl.field.status.active.title`)}
                description={t(`${k}.statusAndTtl.field.status.active.description`)}
                checked={field.state.value === "active"}
                onChange={() => field.handleChange("active")}
              />
              <Choice
                type="radio"
                name="status"
                label={t(`${k}.statusAndTtl.field.status.inactive.title`)}
                description={t(`${k}.statusAndTtl.field.status.inactive.description`)}
                checked={field.state.value === "inactive"}
                onChange={() => field.handleChange("inactive")}
              />
            </Field>
          )}
        </form.Field>
 
        <form.Field name="defaultTtl">
          {(field) => (
            <Field
              label={t(`${k}.statusAndTtl.field.defaultTtl.title`)}
              htmlFor="ttl"
              errors={field.state.meta.errors}
            >
              <select
                id="ttl"
                className={inputCls}
                value={customTtl ? "custom" : String(field.state.value)}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setCustomTtl(true); // keep the current value as the starting point
                  } else {
                    setCustomTtl(false);
                    field.handleChange(Number(e.target.value));
                  }
                }}
              >
                {TTL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(`${k}.statusAndTtl.field.defaultTtl.options.${o.key}`)}
                  </option>
                ))}
                <option value="custom">
                  {t(`${k}.statusAndTtl.field.defaultTtl.options.custom`)}
                </option>
              </select>

              {customTtl && (
                <DurationInput
                  seconds={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  labels={{
                    hours: t(`${k}.statusAndTtl.field.defaultTtl.units.hours`),
                    minutes: t(`${k}.statusAndTtl.field.defaultTtl.units.minutes`),
                    seconds: t(`${k}.statusAndTtl.field.defaultTtl.units.seconds`),
                  }}
                />
              )}
            </Field>
          )}
        </form.Field>
      </Section>
 
      {/* ---------- SOA ---------- */}
      <Section
        title={t(`${k}.soa.title`)}
        help={t(`${k}.soa.description`)}
        className="border-t"
      >
        {/* Backend-owned values: intentionally not part of the form state */}
        <Field
          label={t(`${k}.soa.field.primaryNs.title`)}
          hint={t(`${k}.soa.field.primaryNs.description`)}
        >
          <input readOnly className={readonlyCls} value="ns1.example.no" />
        </Field>
        <Field
          label={t(`${k}.soa.field.hostmaster.title`)}
          hint={t(`${k}.soa.field.hostmaster.description`)}
        >
          <input readOnly className={readonlyCls} value="hostmaster@nhn.no" />
        </Field>
 
        <div className="grid grid-cols-2 gap-4">
          {(["refresh", "retry", "expire", "negativeTtl"] as const).map((key) => (
            <form.Field key={key} name={`soa.${key}`}>
              {(field) => (
                <Field
                  label={t(`${k}.soa.field.${key}.title`)}
                  htmlFor={`soa-${key}`}
                  errors={field.state.meta.errors}
                  hint={t("general.seconds")}
                >
                  <input
                    id={`soa-${key}`}
                    type="number"
                    min={0}
                    className={inputCls}
                    value={Number.isNaN(field.state.value) ? "" : field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                </Field>
              )}
            </form.Field>
          ))}
        </div>
 
        <Field label={t(`${k}.soa.field.serial.title`)}>
          <input readOnly className={readonlyCls} value={t(`${k}.soa.field.serial.value`)} />
        </Field>
      </Section>
 
      {/* ---------- Name servers ---------- */}
      <Section
        title={t(`${k}.nameServers.title`)}
        help={t(`${k}.nameServers.description`)}
        className="border-t"
      >
        <form.Field name="nameServers">
          {(field) => (
            <Field>
              <Choice
                type="radio"
                name="ns"
                label={t(`${k}.nameServers.field.automatic.title`)}
                badge={t(`${k}.nameServers.field.automatic.badge`)}
                description={t(`${k}.nameServers.field.automatic.description`)}
                checked={field.state.value === "automatic"}
                onChange={() => field.handleChange("automatic")}
              />
              <Choice
                type="radio"
                name="ns"
                label={t(`${k}.nameServers.field.manual.title`)}
                disabled={!isSuperAdmin}
                description={
                  t(`${k}.nameServers.field.manual.description`) +
                  (isSuperAdmin ? "" : " " + t(`${k}.nameServers.field.manual.noAccess`))
                }
                checked={field.state.value === "manual"}
                onChange={() => field.handleChange("manual")}
              />
            </Field>
          )}
        </form.Field>
      </Section>
 
      {/* ---------- Advanced (admins only) ---------- */}
      {isAdmin && (
        <Section title={t(`${k}.advanced.title`)} className="border-t">
          <form.Field name="rpz">
            {(field) => (
              <Field>
                <Choice
                  type="checkbox"
                  label={t(`${k}.advanced.field.rpz.title`)}
                  badge={t(`${k}.advanced.field.rpz.badge`)}
                  description={t(`${k}.advanced.field.rpz.description`)}
                  checked={field.state.value}
                  onChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          </form.Field>
        </Section>
      )}
 
      {/* ---------- Actions ---------- */}
      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-200 p-6 pt-5 dark:border-neutral-800">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="rounded bg-emerald-900 box-x-padding py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t(`${k}.actions.creating`) : t(`${k}.actions.create`)}
            </button>
          )}
        </form.Subscribe>
        <button type="button" className="text-sm underline" onClick={onCancel}>
          {t(`${k}.actions.cancel`)}
        </button>
      </div>
    </form>
  );
}
 
/* ------------------------------------------------------------------ */
/* Layout helpers                                                      */
/* ------------------------------------------------------------------ */
 
function Section({
  title,
  help,
  className,
  children,
}: {
  title: string;
  help?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-3 border-neutral-200 px-6 py-6 dark:border-neutral-800 md:grid-cols-[220px_1fr] md:gap-8",
        className,
      )}
    >
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {help && <p className="mt-1 max-w-47.5 text-xs text-neutral-500">{help}</p>}
      </div>
      <div className="flex max-w-lg flex-col gap-4">{children}</div>
    </section>
  );
}
 
function Field({
  label,
  htmlFor,
  hint,
  errors,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  errors?: unknown[];
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const messages = [
    ...new Set(
      (errors ?? [])
        .map((e) => (typeof e === "string" ? e : (e as { message?: string } | undefined)?.message))
        .filter((m): m is string => Boolean(m))
        .map((m) => t(m as never)),
    ),
  ];
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-xs font-semibold">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      {messages.length > 0 && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {messages.join(", ")}
        </p>
      )}
    </div>
  );
}

function DurationInput({
  seconds,
  onChange,
  onBlur,
  labels,
}: {
  seconds: number;
  onChange: (seconds: number) => void;
  onBlur?: () => void;
  labels: { hours: string; minutes: string; seconds: string };
}) {
  const total = Number.isFinite(seconds) ? seconds : 0;
  const parts = {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };

  const update = (key: keyof typeof parts, raw: number) => {
    const next = { ...parts, [key]: Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0 };
    onChange(next.hours * 3600 + next.minutes * 60 + next.seconds);
  };

  return (
    <div className="mt-1 flex flex-wrap items-center gap-4" role="group">
      {(["hours", "minutes", "seconds"] as const).map((key) => (
        <div key={key} className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label={labels[key]}
            className={`${inputCls} max-w-20 pl-0 text-center`}
            value={parts[key]}
            onBlur={onBlur}
            onChange={(e) => update(key, e.target.valueAsNumber)}
          />
          <span className="text-sm">{labels[key]}</span>
        </div>
      ))}
    </div>
  );
}

function Choice({
  type,
  name,
  label,
  description,
  badge,
  checked,
  disabled,
  onChange,
}: {
  type: "checkbox" | "radio";
  name?: string;
  label: string;
  description?: string;
  badge?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 py-1 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        className="mt-1"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="flex flex-col">
        <span className="text-sm font-semibold">
          {label}
          {badge && (
            <span className="ml-2 rounded border border-neutral-300 px-1.5 py-px text-[11px] font-normal dark:border-neutral-700">
              {badge}
            </span>
          )}
        </span>
        {description && <span className="text-xs text-neutral-500">{description}</span>}
      </span>
    </label>
  );
}