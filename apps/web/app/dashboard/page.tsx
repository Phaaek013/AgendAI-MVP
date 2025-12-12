const links = [
  { href: "#inbox", label: "Inbox", description: "Mensagens recentes de todos os canais" },
  { href: "#agenda", label: "Agenda", description: "Compromissos e disponibilidade" },
  { href: "#settings", label: "Settings", description: "Conectores e provedores" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-4 md:grid-cols-3">
        {links.map((link) => (
          <div className="card" key={link.href} id={link.href.substring(1)}>
            <h2 className="text-lg font-semibold">{link.label}</h2>
            <p className="text-sm text-slate-600">{link.description}</p>
            <p className="text-xs text-slate-500 mt-2">
              Placeholder — conecte provedor e APIs para dados reais.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
