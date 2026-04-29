import { Button } from "@/components/ui/button"
import { Github, GitPullRequestArrow, Terminal } from "lucide-react"

const AddRepo = () => {
  return (
    <div
      className="forge-panel group flex cursor-pointer flex-row items-center justify-between rounded-lg p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70"
    >
      <div className="flex flex-row justify-center items-start gap-4">
        <Button
          variant={"outline"}
          className="flex items-center justify-center bg-background/70 group-hover:border-primary/70 group-hover:bg-primary/10 group-hover:text-primary"
          size={"icon"}
        >
          <GitPullRequestArrow size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
        </Button>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 font-code text-xs text-primary">
            <Terminal className="h-3.5 w-3.5" />
            import source
          </div>
          <h1 className="text-xl font-semibold">Open GitHub Repository</h1>
          <p className="max-w-[260px] text-sm text-muted-foreground">Work with repositories in the Forge editor.</p>
        </div>
      </div>

      <div className="hidden h-20 w-20 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary sm:flex">
        <Github className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
      </div>
    </div>
  )
}

export default AddRepo
