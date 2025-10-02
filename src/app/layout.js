import "./globals.css";
import ClientProviders from './components/ClientProviders';

export const metadata = {
  title: "MarTasks - Трекер задач",
  description: "Ваш персональный трекер задач для организации работы и достижения целей",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="font-sans antialiased mt-20">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
