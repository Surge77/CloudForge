import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Terminal } from "lucide-react";
import { signIn } from "@/auth";
import Image from "next/image";

async function handleGoogleSignIn(){
"use server"
await signIn("google", { redirectTo: "/dashboard" })
}

async function handleGithubSignIn(){
"use server"
await signIn("github", { redirectTo: "/dashboard" })
}

const SignInFormClient = () => {
  return (
    <Card className="forge-panel-strong w-full max-w-md overflow-hidden rounded-lg">
      <CardHeader className="items-center space-y-4 border-b border-border/70 px-8 py-8 text-center">
        <Image src="/logo.svg" alt="CloudForge logo" width={58} height={58} />
        <div className="space-y-2">
        <CardTitle className="font-code text-2xl font-semibold tracking-tight">
          Welcome to CloudForge
        </CardTitle>
        <CardDescription>
          Sign in to continue to your browser IDE.
        </CardDescription>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-3 py-2 font-code text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span>&gt; authenticate workspace</span>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 px-8 py-7">
        <form action={handleGoogleSignIn}>
          <Button type="submit" variant={"outline"} className="h-11 w-full bg-background/80 hover:border-primary/60 hover:bg-primary/10">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </Button>
        </form>
        <form action={handleGithubSignIn}>
          <Button type="submit" variant={"outline"} className="h-11 w-full bg-background/80 hover:border-primary/60 hover:bg-primary/10">
            <Github className="mr-2 h-4 w-4" />
            <span>Continue with GitHub</span>
          </Button>
        </form>
        <p className="pt-3 text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInFormClient;
