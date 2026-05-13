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
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors mb-6">
          <ArrowLeft size={13} />
          Voltar ao Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          {artigo.categoria && (
            <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">{artigo.categoria}</span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4 leading-tight">{artigo.titulo}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
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
            <p className="mt-4 text-base text-gray-500 leading-relaxed border-l-2 border-[#c9a84c] pl-4">{artigo.resumo}</p>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#c9a84c]">
          {artigo.conteudo.split("\n").map((para, i) =>
            para.trim() ? <p key={i} className="mb-4 text-gray-600 leading-relaxed">{para}</p> : null
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#060d1a] rounded-2xl p-8 text-center">
          <BookOpen size={28} className="text-[#c9a84c] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Precisa de orientação jurídica?</h3>
          <p className="text-sm text-white/50 mb-5">Nossa equipe está pronta para atender sua demanda com expertise e comprometimento.</p>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] text-sm font-bold rounded-lg transition-colors"
          >
            Falar com um advogado
          </a>
        </div>
      </div>
    </div>
  );
}
