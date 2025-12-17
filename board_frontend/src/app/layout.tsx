import type { Metadata } from 'next';
import './globals.css';
import CursorEffect from '@/components/CursorEffect';

export const metadata: Metadata = {
  title: '게시판 데모',
  description: '게시판 애플리케이션',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <CursorEffect />
        {children}
      </body>
    </html>
  );
}

