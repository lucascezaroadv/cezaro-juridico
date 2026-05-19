import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Cezaro Costa Advocacia e Consultoria Jurídica",
  description:
    "Escritório de advocacia especializado em Direito do Trabalho, Empresarial, Execução e Recuperação de Crédito, LGPD e Compliance. Soluções jurídicas estratégicas para empresas e pessoas físicas.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700;900&display=swap"
        rel="stylesheet"
      />
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
