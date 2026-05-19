import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import LogoCezaro from "@/components/ui/LogoCezaro";

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}


const areas = [
  { label: "Direito do Trabalho", href: "/areas-de-atuacao/trabalhista" },
  { label: "Direito Empresarial", href: "/areas-de-atuacao/empresarial" },
  { label: "Execução e Recuperação de Crédito", href: "/areas-de-atuacao/execucao-credito" },
  { label: "LGPD", href: "/areas-de-atuacao/lgpd" },
  { label: "Consultoria Preventiva", href: "/areas-de-atuacao/consultoria-preventiva" },
  { label: "Contratos", href: "/areas-de-atuacao/contratos" },
  { label: "Compliance", href: "/areas-de-atuacao/compliance" },
];

const escritorioLinks = [
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Áreas de Atuação", href: "/areas-de-atuacao" },
  { label: "Blog Jurídico", href: "/blog" },
  { label: "Contato", href: "/contato" },
  { label: "Portal do Cliente", href: "/portal" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#1A0A0A]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand */}
        <div className="md:col-span-4">
          <Link href="/" className="inline-block mb-6">
            <LogoCezaro variant="white" layout="horizontal" scaleSize={48} />
          </Link>

          <p className="text-white/45 text-sm leading-relaxed font-[family-name:var(--font-lato)] mb-6 max-w-xs">
            Soluções jurídicas estratégicas com comprometimento, ética e excelência técnica desde o primeiro atendimento.
          </p>

          {/* Redes sociais */}
          <div className="flex gap-3">
            {[
              { Icon: InstagramIcon, href: "#", label: "Instagram" },
              { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
              { Icon: FacebookIcon, href: "#", label: "Facebook" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/35 hover:text-white hover:border-[#8B1A1A] hover:bg-[#8B1A1A]/10 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Áreas */}
        <div className="md:col-span-3">
          <h4 className="text-[#8B1A1A] text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-lato)] font-bold mb-5">
            Áreas de Atuação
          </h4>
          <ul className="space-y-2.5">
            {areas.map((a) => (
              <li key={a.label}>
                <Link
                  href={a.href}
                  className="text-white/40 hover:text-white/80 text-sm font-[family-name:var(--font-lato)] transition-colors leading-relaxed"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="md:col-span-2">
          <h4 className="text-[#8B1A1A] text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-lato)] font-bold mb-5">
            O Escritório
          </h4>
          <ul className="space-y-2.5">
            {escritorioLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-white/40 hover:text-white/80 text-sm font-[family-name:var(--font-lato)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div className="md:col-span-3">
          <h4 className="text-[#8B1A1A] text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-lato)] font-bold mb-5">
            Contato
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Phone size={14} className="mt-0.5 text-[#8B1A1A] shrink-0" />
              <div>
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white/80 text-sm font-[family-name:var(--font-lato)] transition-colors"
                >
                  (00) 00000-0000
                </a>
                <p className="text-white/25 text-xs mt-0.5">WhatsApp disponível</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={14} className="mt-0.5 text-[#8B1A1A] shrink-0" />
              <a
                href="mailto:contato@cezarocosta.adv.br"
                className="text-white/50 hover:text-white/80 text-sm font-[family-name:var(--font-lato)] transition-colors"
              >
                contato@cezarocosta.adv.br
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={14} className="mt-0.5 text-[#8B1A1A] shrink-0" />
              <div className="text-white/50 text-sm font-[family-name:var(--font-lato)] leading-relaxed">
                Endereço do Escritório<br />
                Cidade — Estado
              </div>
            </li>
          </ul>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/5500000000000?text=Olá! Gostaria de agendar uma consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold tracking-wide transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.118 1.528 5.847L.057 23.882a.5.5 0 0 0 .613.613l6.035-1.47A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.839 9.839 0 0 1-5.034-1.379l-.36-.215-3.726.978.977-3.726-.214-.36A9.84 9.84 0 0 1 2.118 12C2.118 6.527 6.527 2.118 12 2.118S21.882 6.527 21.882 12 17.473 21.882 12 21.882z" />
            </svg>
            Iniciar conversa
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-white/25 text-xs font-[family-name:var(--font-lato)]">
          <span>© {new Date().getFullYear()} Cezaro Costa Advocacia e Consultoria Jurídica. Todos os direitos reservados.</span>
          <span>OAB/XX 000.000</span>
        </div>
      </div>
    </footer>
  );
}
