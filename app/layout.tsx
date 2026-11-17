import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "CyberSpace Admin",
    template: "%s - CyberSpace Admin",
  },
  description: "Administração interna da CyberSpace.",
  // Ferramenta interna: nunca deve aparecer em motores de busca.
  robots: { index: false, follow: false, nocache: true },
};

// Corre antes de a página aparecer, para o modo escuro não piscar em claro ao carregar.
const aplicarTema = `try{if(localStorage.getItem("tema")==="escuro")document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-MZ" className={`${outfit.variable} h-full font-sans antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: aplicarTema }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
