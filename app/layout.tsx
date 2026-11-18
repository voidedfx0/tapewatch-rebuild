import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TapeWatch — X Layer Intelligence',
  description: 'A workspace for exploring X Layer activity, processors, and wallet intelligence.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
