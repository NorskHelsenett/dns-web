import * as React from "react"
import { cn } from "cn"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header flex items-center gap-2 auto-rows-min rounded-t-xl px-(--card-spacing) border-b has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-sm leading-snug font-bold group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-snug", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

type CardRadioOptionProps = Omit<React.ComponentProps<"div">, "title" | "onChange"> & {
  name: string
  checked: boolean
  onSelect: () => void
  disabled?: boolean
  title: React.ReactNode
  description?: React.ReactNode
}

function CardRadioOption({
  name,
  checked,
  onSelect,
  disabled,
  title,
  description,
  children,
  className,
  ...props
}: CardRadioOptionProps) {
  return (
    <div
      data-slot="card-radio-option"
      data-checked={checked}
      data-disabled={disabled || undefined}
      className={cn(
        "flex items-center justify-between gap-4 px-(--card-spacing) py-(--card-spacing) not-last:border-b",
        className
      )}
      {...props}
    >
      <label
        className={cn(
          "grid grid-cols-[auto_1fr] gap-x-3",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
      >
        <input
          type="radio"
          name={name}
          className="row-span-2 size-4 accent-primary"
          checked={checked}
          disabled={disabled}
          onChange={onSelect}
        />
        <span className="text-sm font-semibold">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </label>
      {children}
    </div>
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-0 -my-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardRadioOption
}
