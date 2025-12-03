import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'pjt - Clean Git Repositories',
  description: 'A powerful cross-platform CLI tool for maintaining clean Git repositories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <RootProvider
          theme={{
            enabled: true,
            attribute: 'class',
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}