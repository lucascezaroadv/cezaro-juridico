import { SignUp } from "@clerk/nextjs";
export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center p-4">
      <SignUp />
    </div>
  );
}
