import './globals.css';

export const metadata = {
  title: 'AgentLaunchHer',
  description: 'Bags-native autonomous agent platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
