import Link from "next/link";
import { Scale, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const areas = [
  "Direito do Trabalho",
  "Direito Empresarial",
  "Execução e Recuperação de Crédito",
  "LGPD",
  "Consultoria Preventiva",
  "Contratos",
  "Compliance",
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#040a15] border-t border-[#c9a84c]/20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full border border-[#c9a84c] flex items-center justify-center">
              <Scale className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div>
              <div className="font-[family-name:var(--font-playfair)] text-white text-sm font-bold">
                CEZARO COSTA
              </div>
              <div className="text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-lato)]">
                Advocacia & Consultoria
              </div>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed font-[family-name:var(--font-lato)]">
            Soluções jurídicas estratégicas com comprometimento, ética e excelência.
          </p>
          <div className="flex gap-4 mt-6">
            {[ExternalLink, ExternalLink, ExternalLink].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded border border-white/10 flex items-center justify-center text-white/40 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Areas */}
        <div>
          <h4 className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-lato)] font-bold mb-5">
            Áreas de Atuação
          </h4>
          <ul className="space-y-2.5">
            {areas.map((a) => (
              <li key={a}>
                <Link
                  href="/areas-de-atuacao"
                  className="text-white/50 hover:text-white/90 text-sm font-[family-name:var(--font-lato)] transition-colors"
                >
                  {a}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-lato)] font-bold mb-5">
            O Escritório
          </h4>
          <ul className="space-y-2.5">
            {["Sobre Nós", "Blog Jurídico", "Contato", "Portal do Cliente", "Política de Privacidade"].map((l) => (
              <li key={l}>
                <Link
                  href="#"
                  className="text-white/50 hover:text-white/90 text-sm font-[family-name:var(--font-lato)] transition-colors"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-lato)] font-bold mb-5">
            Contato
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/50 text-sm font-[family-name:var(--font-lato)]">
              <Phone size={15} className="mt-0.5 text-[#c9a84c] shrink-0" />
              (00) 00000-0000
            </li>
            <li className="flex items-start gap-3 text-white/50 text-sm font-[family-name:var(--font-lato)]">
              <Mail size={15} className="mt-0.5 text-[#c9a84c] shrink-0" />
              contato@cezarocosta.adv.br
            </li>
            <li className="flex items-start gap-3 text-white/50 text-sm font-[family-name:var(--font-lato)]">
              <MapPin size={15} className="mt-0.5 text-[#c9a84c] shrink-0" />
              Endereço do Escritório
              <br />
              Cidade — Estado
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-white/30 text-xs font-[family-name:var(--font-lato)]">
          <span>© {new Date().getFullYear()} Cezaro Costa Advocacia e Consultoria Jurídica. Todos os direitos reservados.</span>
          <span>OAB/XX 000.000</span>
        </div>
      </div>
    </footer>
  );
}
