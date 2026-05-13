import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ErpSidebar from "@/components/layout/ErpSidebar";
import ErpHeader from "@/components/layout/ErpHeader";

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden">
      <ErpSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ErpHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
