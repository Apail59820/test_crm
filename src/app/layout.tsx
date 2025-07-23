import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import "../styles/globals.scss";

import AppProviders from "@/components/AppProviders/AppProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
