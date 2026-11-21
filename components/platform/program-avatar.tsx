import Image from "next/image";

const tamanhos = {
  md: "h-11 w-14",
  lg: "h-14 w-20",
  xl: "h-16 w-24",
};

/**
 * Logótipo do programa num rectângulo branco com contorno (os logótipos largos precisam de largura). É decorativo: o nome da
 * empresa está sempre escrito ao lado.
 */
export function ProgramAvatar({
  logo,
  nome,
  size = "md",
}: {
  logo: string;
  /** Sem logótipo, mostram-se as iniciais deste nome. */
  nome?: string;
  size?: keyof typeof tamanhos;
}) {
  if (!logo) {
    return (
      <span data-fixo aria-hidden className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-primary/10 text-sm font-bold text-primary-strong ${tamanhos[size]}`}>
        {(nome ?? "?").slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span
      data-fixo
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-2 ${tamanhos[size]}`}
    >
      <Image src={logo} alt="" width={96} height={64} unoptimized className="size-full object-contain" />
    </span>
  );
}
