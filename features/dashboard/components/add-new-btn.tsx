"use client";
import TemplateSelectionModal from "@/components/modal/template-selector-modal";
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
        className="forge-panel group relative flex cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_28px_70px_-30px_rgba(255,90,31,0.55)]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex flex-row items-start justify-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/25 to-transparent text-primary transition-colors duration-300 group-hover:from-primary/40">
            <Plus size={22} className="transition-transform duration-300 group-hover:rotate-90" />
          </span>
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2 font-code text-[0.7rem] uppercase tracking-[0.14em] text-primary">
              <Terminal className="h-3.5 w-3.5" />
              initialize runtime
            </div>
            <h2 className="font-display text-2xl font-medium tracking-tight">Add New</h2>
            <p className="mt-1 max-w-[240px] text-sm text-muted-foreground">Boot a playground with editor, preview, and terminal.</p>
          </div>
        </div>

        <div className="relative hidden h-20 w-20 items-center justify-center rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 to-transparent text-primary shadow-[0_16px_40px_-18px_rgba(255,90,31,0.6)] sm:flex">
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
