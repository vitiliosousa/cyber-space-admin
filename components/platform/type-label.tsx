export function TypeLabel({ tipo }: { tipo: "publico" | "privado" }) {
  return <>{tipo === "publico" ? "Público" : "Privado"}</>;
}
