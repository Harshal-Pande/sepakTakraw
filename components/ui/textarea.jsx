import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "bg-white text-black border-gray-300",
        "placeholder:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
        className
      )}
      {...props} />
  );
}

export { Textarea }
