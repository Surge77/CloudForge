
import  {Footer}  from "@/features/home/footer";
import  {Header}  from "@/features/home/header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
// import { usePathname } from "next/navigation";

export const metadata: Metadata = {
    title: {
        template: "%s | CloudForge",
        default: "CloudForge",
    },
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div
        className={cn(
          "fixed inset-0 forge-grid",
        )}
      />
       <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,90,31,0.18),transparent_34%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.2))]"/>
      
            <main className="z-20 relative w-full pt-0 md:pt-0  ">
          
                {children}
            </main>
            <Footer />
        </>
    );
}
