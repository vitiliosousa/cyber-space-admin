"use client";

import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="text-sm text-danger">
      {children}
    </p>
  );
}

function Hint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="text-sm text-muted-foreground">
      {children}
    </p>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
      {children}
    </label>
  );
}

/** Junta os ids da dica e do erro para o aria-describedby. */
function describedBy(id: string, error?: string, hint?: string) {
  return [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "name"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

/** Campo de texto (Input do shadcn) com etiqueta visível, dica e erro ligados por aria-describedby. */
export function TextField({ id, label, error, hint, ...input }: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...input}
      />
      {!error && <Hint id={`${id}-hint`}>{hint}</Hint>}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  error?: string;
  hint?: string;
};

/** Campo de palavra-passe com botão de mostrar e ocultar. */
export function PasswordField({ id, label, autoComplete, error, hint }: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-pressed={show}
          aria-label={show ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-r-2xl text-muted-foreground transition-colors hover:text-ink"
        >
          <HugeiconsIcon icon={show ? ViewOffSlashIcon : ViewIcon} size={20} aria-hidden />
        </button>
      </div>
      {!error && <Hint id={`${id}-hint`}>{hint}</Hint>}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
  error?: string;
  onValueChange?: (value: string) => void;
};

/**
 * Lista de opções (Select do shadcn) com etiqueta visível e erro. O valor segue
 * num campo escondido com o nome `id`, por isso funciona em formulários normais.
 */
export function SelectField({ id, label, options, placeholder, defaultValue, required, error, onValueChange }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select name={id} defaultValue={defaultValue || undefined} required={required} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

type TextAreaFieldProps = Omit<ComponentProps<"textarea">, "id" | "name"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

/** Área de texto (Textarea do shadcn) com etiqueta visível, dica e erro. */
export function TextAreaField({ id, label, error, hint, className, ...textarea }: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={className}
        {...textarea}
      />
      {!error && <Hint id={`${id}-hint`}>{hint}</Hint>}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

/** Mensagem de erro do formulário inteiro (anunciada por leitores de ecrã). */
export function FormAlert({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      {children}
    </p>
  );
}
