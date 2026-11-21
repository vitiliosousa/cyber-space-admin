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
  const configurar = state.passo === "configurar";
  const codigo = state.passo === "codigo" || configurar;

  // Depois de submeter, o botão fica desativado e o foco perde-se: levamo-lo ao primeiro erro ou ao novo campo.
  useEffect(() => {
    const invalido = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (invalido) invalido.focus();
    else if (codigo) formRef.current?.querySelector<HTMLElement>("#codigo")?.focus();
    else if (state.message) submitRef.current?.focus();
  }, [state, codigo]);

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-3">
      <input type="hidden" name="passo" value={configurar ? "configurar" : codigo ? "codigo" : "credenciais"} />
      {configurar && <input type="hidden" name="segredo" value={state.segredo ?? ""} />}
      {/* Só no segundo passo: no primeiro, o campo visível já se chama "email". */}
      {codigo && <input type="hidden" name="email" value={state.email ?? ""} />}
      <FormAlert>{state.message}</FormAlert>

      {codigo ? (
        <>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{configurar ? "Ative os dois passos" : "Confirme a sua identidade"}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {configurar ? (
                <>É o seu primeiro acesso. Leia o código QR com uma aplicação de autenticação e escreva o código de 6 dígitos que ela mostra.</>
              ) : (
                <>
                  Escreva o código de 6 dígitos da aplicação de autenticação de <span className="font-medium text-ink">{state.email}</span>.
                </>
              )}
            </p>
          </div>
          {configurar && state.qr && (
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- o QR é um data URL gerado no servidor */}
              <img src={state.qr} alt="Código QR para a aplicação de autenticação" width={160} height={160} className="size-40 rounded-xl" />
              <div className="min-w-0 text-sm">
                <p className="font-medium">Não consegue ler o QR?</p>
                <p className="text-muted-foreground">Escreva este segredo na aplicação:</p>
                <p className="mt-1 break-all font-mono text-ink">{state.segredo}</p>
              </div>
            </div>
          )}
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
