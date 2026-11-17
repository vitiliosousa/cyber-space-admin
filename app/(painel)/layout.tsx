import { PlatformShell } from "@/components/platform/shell";

export default function PainelLayout({ children }: LayoutProps<"/">) {
  return <PlatformShell>{children}</PlatformShell>;
}
