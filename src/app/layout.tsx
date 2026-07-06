import type { Metadata } from "next";

import "../styles/bootstrap.min.css";
import "../styles/common.css";
import "../styles/main.css";
import "../styles/responsive.css";

export const metadata: Metadata = {
  title: "Buddy Script",
  icons: {
    icon: "/assets/images/logo-copy.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
