import Link from "next/link";
import { BookOpen, Tag } from "lucide-react";

type Artigo = {
  id: string; titulo: string; slug: string; resumo: string | null;
  categoria: string | null; tags: string[]; imagemCapa: string | null;
  publicadoEm: string | null; criadoEm: string;
};

async function getArtigos(categoria?: string): Promise<{ artigos: Artigo[]; total: number }> {
  try {
    const params = new URLSearchParams({ page: "1" });
    if (categoria) params.set("categoria", categoria);
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/artigos?${params}`, { cache: "no-store" });
    return res.json();
  } catch {
    return { artigos: [], total: 0 };
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const { artigos, total } = await getArtigos(categoria);

  const CATEGORIAS = ["Trabalhista", "Empresarial", "LGPD", "Contratos", "Compliance", "Tributário"];

  return (
    <div className="bg-white min-h-screen font-[family-name:var(--font-lato)]">
      {/* Hero */}
      <section className="bg-[#8B1A1A] pt-32 pb-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <BookOpen size={12} />
            Blog Jurídico
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-white font-bold mb-5">
            Conhecimento a serviço<br />
            <em className="not-italic font-light">do seu negócio e seus direitos</em>
          </h1>
          <div className="h-px w-12 bg-white/30 mx-auto mb-6" />
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            Artigos, análises e orientações jurídicas para empresas e pessoas físicas.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={`px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
              !categoria ? "bg-[#8B1A1A] text-white" : "bg-[#F8F6F4] text-[#3D2020]/60 hover:bg-gray-100"
            }`}
          >
            Todos ({total})
          </Link>
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat}
              href={`/blog?categoria=${cat}`}
              className={`px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                categoria === cat ? "bg-[#8B1A1A] text-white" : "bg-[#F8F6F4] text-[#3D2020]/60 hover:bg-gray-100"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {artigos.length === 0 ? (
          <div className="text-center py-24 text-[#3D2020]/35">
            <BookOpen size={36} className="mx-auto mb-4 opacity-30" />
            <p className="font-[family-name:var(--font-cormorant)] text-xl">Nenhum artigo publicado ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artigos.map((a) => (
              <Link
                key={a.id}
                href={`/blog/${a.slug}`}
                className="group flex flex-col bg-white border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#8B1A1A]/25 transition-all duration-300"
              >
                {a.imagemCapa ? (
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.imagemCapa}
                      alt={a.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-[#8B1A1A] flex items-center justify-center">
                    <BookOpen size={32} className="text-white/20" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6">
                  {a.categoria && (
                    <span className="text-[10px] font-bold text-[#8B1A1A] uppercase tracking-[0.2em] mb-2">
                      {a.categoria}
                    </span>
                  )}
                  <h2 className="font-[family-name:var(--font-cormorant)] text-lg font-bold text-[#1A0A0A] leading-snug mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                    {a.titulo}
                  </h2>
                  {a.resumo && (
                    <p className="text-xs text-[#3D2020]/55 leading-relaxed line-clamp-3 mb-3 flex-1">{a.resumo}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-[#3D2020]/40">
                      {new Date(a.publicadoEm ?? a.criadoEm).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {a.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-[#3D2020]/40">
                        <Tag size={9} />
                        <span className="truncate max-w-20">{a.tags.slice(0, 2).join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
