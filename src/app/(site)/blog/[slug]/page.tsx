import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag, BookOpen } from "lucide-react";

type Artigo = {
  titulo: string; slug: string; resumo: string | null; conteudo: string;
  categoria: string | null; tags: string[]; imagemCapa: string | null;
  publicadoEm: string | null; criadoEm: string;
};

async function getArtigo(slug: string): Promise<Artigo | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/artigos/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo) notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero image */}
      {artigo.imagemCapa && (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artigo.imagemCapa} alt={artigo.titulo} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-[#3D2020]/50 hover:text-[#8B1A1A] transition-colors mb-6 font-[family-name:var(--font-lato)]">
          <ArrowLeft size={13} />
          Voltar ao Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          {artigo.categoria && (
            <span className="text-[10px] font-bold text-[#8B1A1A] uppercase tracking-[0.25em]">{artigo.categoria}</span>
          )}
          <h1 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-bold text-[#1A0A0A] mt-2 mb-4 leading-tight">{artigo.titulo}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#3D2020]/40 font-[family-name:var(--font-lato)]">
            <span>
              {new Date(artigo.publicadoEm ?? artigo.criadoEm).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "long", year: "numeric"
              })}
            </span>
            {artigo.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag size={11} />
                <span>{artigo.tags.join(", ")}</span>
              </div>
            )}
          </div>

          {artigo.resumo && (
            <p className="mt-5 text-base text-[#3D2020]/60 leading-relaxed border-l-2 border-[#8B1A1A] pl-4 font-[family-name:var(--font-lato)]">{artigo.resumo}</p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none prose-headings:text-[#1A0A0A] prose-headings:font-bold prose-p:text-[#3D2020]/65 prose-p:leading-relaxed prose-a:text-[#8B1A1A] font-[family-name:var(--font-lato)]">
          {artigo.conteudo.split("\n").map((para, i) =>
            para.trim() ? <p key={i} className="mb-4 text-[#3D2020]/65 leading-relaxed">{para}</p> : null
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#8B1A1A] p-8 text-center">
          <BookOpen size={28} className="text-white/40 mx-auto mb-3" />
          <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-white mb-2">Precisa de orientação jurídica?</h3>
          <p className="text-sm text-white/55 mb-6 font-[family-name:var(--font-lato)]">Nossa equipe está pronta para atender sua demanda com expertise e comprometimento.</p>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-[#8B1A1A] text-sm font-bold transition-colors font-[family-name:var(--font-lato)]"
          >
            Falar com um advogado
          </a>
        </div>
      </div>
    </div>
  );
}
