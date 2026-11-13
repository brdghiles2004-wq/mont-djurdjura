
export const metadata = {
  title: "Administration | Mont Djurdjura",
  description: "Espace d'administration de Mont Djurdjura.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
