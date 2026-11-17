/** Etiqueta de estado: texto e cores vêm de um mapa em lib/exemplo.ts. */
export function Selo({ info, className = "" }: { info: { label: string; estilo: string }; className?: string }) {
  return <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ${info.estilo} ${className}`}>{info.label}</span>;
}
