/** Marca em texto: "Cyber" em tinta e "Space" em roxo. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      Cyber<span className="text-primary">Space</span>
    </span>
  );
}
