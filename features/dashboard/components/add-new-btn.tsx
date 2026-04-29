"use client";
import TemplateSelectionModal from "@/components/modal/template-selector-modal";
import { Button } from "@/components/ui/button"
import { createPlayground } from "@/features/playground/actions";
import { FolderPlus, Plus, Terminal } from 'lucide-react'
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async(data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    const res = await createPlayground(data);
    toast("Playground created successfully");
    setIsModalOpen(false)
    router.push(`/playground/${res?.id}`)
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="forge-panel group flex cursor-pointer flex-row items-center justify-between rounded-lg p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex items-center justify-center bg-background/70 group-hover:border-primary/70 group-hover:bg-primary/10 group-hover:text-primary"
            size={"icon"}
          >
            <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
          </Button>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2 font-code text-xs text-primary">
              <Terminal className="h-3.5 w-3.5" />
              initialize runtime
            </div>
            <h1 className="text-xl font-semibold">Add New</h1>
            <p className="max-w-[240px] text-sm text-muted-foreground">Create a playground with editor, preview, and terminal.</p>
          </div>
        </div>

        <div className="hidden h-20 w-20 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary sm:flex">
          <FolderPlus className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      
      <TemplateSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewButton
