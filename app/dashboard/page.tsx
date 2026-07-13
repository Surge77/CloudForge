import AddNewButton from "@/features/dashboard/components/add-new-btn";
import AddRepo from "@/features/dashboard/components/add-repo";

import ProjectTable from "@/features/dashboard/components/project-table";
import { getAllPlaygroundForUser , deleteProjectById ,editProjectById , duplicateProjectById} from "@/features/playground/actions";
import { FolderCode, Sparkles } from "lucide-react";

const EmptyState = () => (
  <div className="forge-panel relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl py-20 text-center">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,90,31,0.14),transparent_70%)]" />
    <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 to-transparent text-primary shadow-[0_16px_50px_-16px_rgba(255,90,31,0.6)]">
      <FolderCode className="h-9 w-9" />
    </div>
    <h2 className="font-display text-3xl font-medium tracking-tight">
      The forge is <span className="forge-molten">cold</span>
    </h2>
    <p className="relative mt-3 max-w-md text-sm leading-7 text-muted-foreground">
      Spin up your first playground and we&apos;ll boot a runtime, editor, terminal, and live
      preview — all in this tab.
    </p>
  </div>
);

const DashboardMainPage = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 forge-grid opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(70%_100%_at_50%_0%,rgba(255,90,31,0.12),transparent_65%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 font-code text-xs uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            workspace dashboard
          </div>
          <div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              Your <span className="forge-molten">forge</span>.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              Launch, duplicate, rename, and organize browser-based runtimes — each one a full
              stack in a single tab.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <AddNewButton />
          <AddRepo />
        </div>

        <div className="mt-12 flex w-full flex-col items-center justify-center">
          {playgrounds && playgrounds.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectTable
              projects={playgrounds || []}
              onDeleteProject={deleteProjectById}
              onUpdateProject={editProjectById}
              onDuplicateProject={duplicateProjectById}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMainPage;
