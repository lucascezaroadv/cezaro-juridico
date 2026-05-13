import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cezaro Costa Advocacia e Consultoria Jurídica",
  description:
    "Escritório de advocacia especializado em Direito do Trabalho, Empresarial, Execução e Recuperação de Crédito, LGPD e Compliance. Soluções jurídicas estratégicas para empresas e pessoas físicas.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${lato.variable}`}>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
