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
  size = "md",
}: {
  logo: string;
  size?: keyof typeof tamanhos;
}) {
  return (
    <span
      data-fixo
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-2 ${tamanhos[size]}`}
    >
      <Image src={logo} alt="" width={96} height={64} className="size-full object-contain" />
    </span>
  );
}
