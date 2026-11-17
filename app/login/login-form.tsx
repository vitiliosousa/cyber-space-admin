"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FormAlert, PasswordField, TextField } from "@/components/auth/fields";
import { primaryButton } from "@/components/ui/buttons";
import { iniciarSessao, type LoginState } from "./actions";

const inicial: LoginState = {};

function Passos({ aoVoltar }: { aoVoltar: () => void }) {
  const [state, formAction, pending] = useActionState(iniciarSessao, inicial);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const codigo = state.passo === "codigo";

  // Depois de submeter, o botão fica desativado e o foco perde-se: levamo-lo ao primeiro erro ou ao novo campo.
  useEffect(() => {
    const invalido = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (invalido) invalido.focus();
    else if (codigo) formRef.current?.querySelector<HTMLElement>("#codigo")?.focus();
    else if (state.message) submitRef.current?.focus();
  }, [state, codigo]);

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-3">
      <input type="hidden" name="passo" value={codigo ? "codigo" : "credenciais"} />
      {/* Só no segundo passo: no primeiro, o campo visível já se chama "email". */}
      {codigo && <input type="hidden" name="email" value={state.email ?? ""} />}
      <FormAlert>{state.message}</FormAlert>

      {codigo ? (
        <>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Confirme a sua identidade</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Escreva o código de 6 dígitos da aplicação de autenticação de <span className="font-medium text-ink">{state.email}</span>.
            </p>
          </div>
          <div className="pt-4">
            <TextField
              id="codigo"
              label="Código de 6 dígitos"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={7}
              placeholder="000 000"
              required
              error={state.errors?.codigo}
              hint="Perdeu o telemóvel? Fale com um super-administrador para repor o acesso."
            />
          </div>
          <button ref={submitRef} type="submit" disabled={pending} className={primaryButton}>
            {pending ? "A verificar…" : "Verificar e entrar"}
          </button>
          <button
            type="button"
            onClick={aoVoltar}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-1 text-sm font-medium text-primary-strong hover:underline"
          >
            Usar outra conta
          </button>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Entrar na administração</h1>
            <p className="mt-2 text-lg text-muted-foreground">Acesso reservado à equipa da CyberSpace.</p>
          </div>
          <div className="space-y-3 pt-4">
            <TextField
              id="email"
              label="E-mail"
              type="email"
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              defaultValue={state.email}
              placeholder="nome@cyberspace.co.mz"
              error={state.errors?.email}
            />
            <PasswordField id="password" label="Palavra-passe" autoComplete="current-password" error={state.errors?.password} />
            <button ref={submitRef} type="submit" disabled={pending} className={primaryButton}>
              {pending ? "A entrar…" : "Continuar"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default function LoginForm() {
  // Mudar a chave recomeça o formulário do primeiro passo.
  const [ronda, setRonda] = useState(0);
  return <Passos key={ronda} aoVoltar={() => setRonda((r) => r + 1)} />;
}
