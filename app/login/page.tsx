import type { Metadata } from "next";
import { SplitLayout } from "@/components/auth/split-layout";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <SplitLayout
      panel={{
        title: "Administração da plataforma.",
        points: ["Acesso só para a equipa da CyberSpace", "Verificação em dois passos obrigatória", "Tudo o que faz fica registado"],
      }}
    >
      <LoginForm />
    </SplitLayout>
  );
}
