'use client'

import * as React from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'

import { cn } from 'cn'

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive>) {
  return (
    <ToggleGroupPrimitive
      data-slot='toggle-group'
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-md',
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup }
export type { VariantProps } from 'class-variance-authority'
