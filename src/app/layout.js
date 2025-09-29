import "./globals.css";
import { AppProvider } from './contexts/AppContext';

export const metadata = {
  title: "MarTasks - Трекер задач",
  description: "Ваш персональный трекер задач для организации работы и достижения целей",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
