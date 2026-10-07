import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { LayoutWrapper } from '@/components/corporate/layout-wrapper';

export const metadata: Metadata = {
  title: 'Corex Academia — Plataforma de Capacitación Empresarial',
  description: 'Plataforma e-learning para capacitación empresarial certificada SENCE en Chile.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
