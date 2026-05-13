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
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#060d1a] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen size={14} />
            Blog Jurídico
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Conhecimento a serviço<br />
            <span className="text-[#c9a84c]">do seu negócio e seus direitos</span>
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Artigos, análises e orientações jurídicas para empresas e pessoas físicas.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Categorias */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/blog"
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !categoria ? "bg-[#060d1a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todos ({total})
          </Link>
          {CATEGORIAS.map(cat => (
            <Link
              key={cat}
              href={`/blog?categoria=${cat}`}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                categoria === cat ? "bg-[#060d1a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {artigos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum artigo publicado ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigos.map(a => (
              <Link
                key={a.id}
                href={`/blog/${a.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#c9a84c]/20 transition-all"
              >
                {a.imagemCapa ? (
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.imagemCapa} alt={a.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#060d1a] to-[#0d1b2a] flex items-center justify-center">
                    <BookOpen size={32} className="text-[#c9a84c]/30" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-5">
                  {a.categoria && (
                    <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest mb-2">{a.categoria}</span>
                  )}
                  <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#c9a84c] transition-colors line-clamp-2">
                    {a.titulo}
                  </h2>
                  {a.resumo && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3 flex-1">{a.resumo}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">
                      {new Date(a.publicadoEm ?? a.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    {a.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
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
