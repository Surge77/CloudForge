import { cn } from "@/lib/utils"
import { ForgeLoader } from "@/components/ui/forge-loader"

function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <ForgeLoader
      size="sm"
      className={cn(className)}
      {...props}
    />
  )
}

export { Spinner }
