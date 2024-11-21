import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Air Assistant",
  description: "Air BnB AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://air-assitant.vercel.app/logo3.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
