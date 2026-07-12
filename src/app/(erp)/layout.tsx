import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/session";
import ErpSidebar from "@/components/layout/ErpSidebar";
import ErpHeader from "@/components/layout/ErpHeader";

export default async function ErpLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-[#F8F6F4] overflow-hidden">
      <ErpSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ErpHeader session={session} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
