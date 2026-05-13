import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Área Restrita</div>
          <h1 className="text-white text-2xl font-bold">Acesso ao Sistema</h1>
          <p className="text-white/40 text-sm mt-1">Cezaro Costa Advocacia</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: "bg-[#0a1428] border border-white/10 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-white/50",
              formFieldLabel: "text-white/70",
              formFieldInput:
                "bg-[#060d1a] border-white/10 text-white focus:border-[#c9a84c]",
              formButtonPrimary:
                "bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] font-bold",
              footerActionLink: "text-[#c9a84c]",
            },
          }}
        />
      </div>
    </div>
  );
}
