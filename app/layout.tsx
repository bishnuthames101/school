import './globals.css';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const fontsUrl =
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;600;700` +
  `&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;500;600;700&display=swap`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          '--color-primary': config.colors.primary,
          '--color-primary-light': config.colors.primaryLight,
          '--color-primary-dark': config.colors.primaryDark,
          '--color-primary-50': config.colors.primary50,
          '--color-primary-100': config.colors.primary100,
          '--color-accent': config.colors.accent,
          '--color-secondary': config.colors.secondary,
          '--font-heading': `"${config.fonts.heading}", serif`,
          '--font-body': `"${config.fonts.body}", sans-serif`,
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
