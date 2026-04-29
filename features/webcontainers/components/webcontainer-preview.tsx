"use client";

import React, { useEffect, useRef, useState } from "react";
import type { TemplateFolder } from "@/features/playground/libs/path-to-json";
import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Monitor, X, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { TerminalRef } from "./terminal";
import { WebContainer } from "@webcontainer/api";
import type { Templates } from "@prisma/client";
import { templateConfig } from "@/lib/template";
import { ForgeLoader } from "@/components/ui/forge-loader";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  template: Templates;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  terminalRef?: React.RefObject<TerminalRef | null>;
  onClose?: () => void;
  forceResetup?: boolean; // Optional prop to force re-setup
}

const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({
  templateData,
  template,
  error,
  instance,
  isLoading,
  terminalRef,
  onClose,
  forceResetup = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);
  const setupStartedRef = useRef(false);

  const runtimeConfig = templateConfig[template];

  // Reset setup state when forceResetup changes
  useEffect(() => {
    if (forceResetup) {
      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setupStartedRef.current = false;
      setPreviewUrl("");
      setCurrentStep(0);
    }
  }, [forceResetup]);

  useEffect(() => {
    async function setupContainer() {
      // Don't run setup if it's already complete or in progress
      if (
        !instance ||
        isSetupComplete ||
        isSetupInProgress ||
        setupStartedRef.current
      ) {
        return;
      }

      try {
        setupStartedRef.current = true;
        setIsSetupInProgress(true);
        setSetupError(null);

        // Check if server is already running by testing if files are already mounted
        try {
          const packageJsonExists = await instance.fs.readFile('package.json', 'utf8');
          if (packageJsonExists) {
            // Files are already mounted, just reconnect to existing server
            if (terminalRef?.current?.writeToTerminal) {
              terminalRef?.current.writeToTerminal("🔄 Reconnecting to existing WebContainer session...\r\n");
            }

            // Check if server is already running
            instance.on("server-ready", (port: number, url: string) => {
              if (terminalRef?.current?.writeToTerminal) {
                terminalRef?.current.writeToTerminal(`Reconnected to server at ${url}\r\n`);
              }
              setPreviewUrl(url);
              setIsSetupComplete(true);
              setIsSetupInProgress(false);
            });

            setCurrentStep(4);
            setIsSetupComplete(true);
            setIsSetupInProgress(false);
            return;
          }
        } catch {
          // Files don't exist, proceed with normal setup
        }

        // Step 1: Transform data
        setCurrentStep(1);

        // Write to terminal
        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal("Transforming template data...\r\n");
        }

        const files = transformToWebContainerFormat(templateData);

        setCurrentStep(2);

        // Step 2: Mount files
        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal("Mounting files to WebContainer...\r\n");
        }

        await instance.mount(files);

        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal("Files mounted successfully\r\n");
        }

        setCurrentStep(3);

        // Step 3: Install dependencies
        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal("Installing dependencies...\r\n");
        }

        const [installCommand, ...installArgs] = runtimeConfig.installCommand;
        const installProcess = await instance.spawn(installCommand, installArgs);

        // Stream install output to terminal
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              // Write directly to terminal
              if (terminalRef?.current?.writeToTerminal) {
                terminalRef?.current.writeToTerminal(data);
              }
            },
          })
        );

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error(`Failed to install dependencies. Exit code: ${installExitCode}`);
        }

        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal("Dependencies installed successfully\r\n");
        }

        setCurrentStep(4);

        // Step 4: Start the server
        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal("Starting development server...\r\n");
        }

        const [startCommand, ...startArgs] = runtimeConfig.startCommand;
        const startProcess = await instance.spawn(startCommand, startArgs);

        // Listen for server ready event
        instance.on("server-ready", (port: number, url: string) => {
          if (terminalRef?.current?.writeToTerminal) {
            terminalRef?.current.writeToTerminal(`Server ready on port ${port}: ${url}\r\n`);
          }
          setPreviewUrl(url);
          setIsSetupComplete(true);
          setIsSetupInProgress(false);
        });

        // Handle start process output - stream to terminal
        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              if (terminalRef?.current?.writeToTerminal) {
                terminalRef?.current.writeToTerminal(data);
              }
            },
          })
        );

      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);

        if (terminalRef?.current?.writeToTerminal) {
          terminalRef?.current.writeToTerminal(`❌ Error: ${errorMessage}\r\n`);
        }

        setSetupError(errorMessage);
        setIsSetupInProgress(false);
      }
    }

    setupContainer();
  }, [
    instance,
    runtimeConfig.installCommand,
    runtimeConfig.startCommand,
    terminalRef,
    templateData,
    isSetupComplete,
    isSetupInProgress,
  ]);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Don't kill processes or cleanup when component unmounts
      // The WebContainer should persist across component re-mounts
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="forge-panel text-center space-y-4 max-w-md rounded-lg p-6">
          <ForgeLoader size="lg" className="mx-auto" />
          <h3 className="text-lg font-medium">Initializing WebContainer</h3>
          <p className="text-sm text-muted-foreground">
            Setting up the environment for your project...
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="max-w-md rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
            <div className="mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <h3 className="font-semibold">Preview Error</h3>
            </div>
            <p className="text-sm">{error || setupError}</p>
            <p className="mt-3 text-xs text-destructive/80">
              Use the Terminal button in the editor toolbar to inspect runtime
              output or run commands.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    } else if (stepIndex === currentStep) {
      return <ForgeLoader size="sm" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-border" />;
    }
  };

  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span className={`text-sm font-medium ${
        isComplete ? 'text-emerald-500' :
        isActive ? 'text-primary' :
        'text-muted-foreground'
      }`}>
        {label}
      </span>
    );
  };

  const panelHeader = (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/80 bg-background/80 px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Monitor className="h-4 w-4 text-primary" />
        <div className="min-w-0">
          <p className="m-0 truncate font-code text-xs font-medium uppercase tracking-normal text-foreground">
            Output
          </p>
        </div>
      </div>
      {onClose && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close output panel"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close output</TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      {panelHeader}
      {!previewUrl ? (
        <div className="h-full flex flex-col">
          <div className="forge-panel mx-auto m-5 w-full max-w-md rounded-lg p-6">


            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                {getStepIcon(1)}
                {getStepText(1, "Transforming template data")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(2)}
                {getStepText(2, "Mounting files")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(3)}
                {getStepText(3, "Installing dependencies")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(4)}
                {getStepText(4, "Starting development server")}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Preview */}
          <div className="flex-1">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
