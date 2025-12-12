import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">Bem-vindo ao AgendAI</h2>
      <p className="text-slate-700 mt-2">
        Acesse o painel para acompanhar mensagens, agenda e configurações.
      </p>
      <div className="mt-4">
        <Link href="/dashboard">Ir para dashboard</Link>
      </div>
    </div>
  );
}
