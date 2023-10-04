import './globals.css';
import type { Metadata } from 'next';
import { AppLayout } from '@/layouts';

export const metadata: Metadata = {
  title: 'AWS IoT AppKit NextJS Demo Dashboard',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
