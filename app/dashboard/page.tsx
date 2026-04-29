import AddNewButton from "@/features/dashboard/components/add-new-btn";
import AddRepo from "@/features/dashboard/components/add-repo";

import ProjectTable from "@/features/dashboard/components/project-table";
import { getAllPlaygroundForUser , deleteProjectById ,editProjectById , duplicateProjectById} from "@/features/playground/actions";
import { FolderCode, Terminal } from "lucide-react";

const EmptyState = () => (
  <div className="forge-panel flex w-full flex-col items-center justify-center rounded-lg py-16 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
      <FolderCode className="h-8 w-8 text-primary" />
    </div>
    <h2 className="text-xl font-semibold">No projects found</h2>
    <p className="mt-2 max-w-md text-sm text-muted-foreground">
      Create a playground to initialize a runtime, editor, terminal, and live preview.
    </p>
  </div>
);

const DashboardMainPage = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 forge-grid opacity-60" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex w-full flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 font-code text-xs text-primary">
          <Terminal className="h-3.5 w-3.5" />
          Workspace dashboard
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your CloudForge projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Launch, duplicate, rename, and organize browser-based runtimes.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>
      <div className="mt-10 flex flex-col justify-center items-center w-full">
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
