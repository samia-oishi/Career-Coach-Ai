import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function AboutPage() {
  return <><Navbar /><main className="container-page py-12"><h1 className="text-5xl font-black">About CareerCoach Ai</h1><p className="mt-6 max-w-3xl text-lg leading-8" style={{ color: 'var(--muted)' }}>CareerCoach Ai helps technology learners and professionals compare career paths, understand skill expectations, and turn experience into focused next steps. The platform combines realistic career data with AI features designed to support honest, practical career planning.</p><div className="mt-10 grid gap-6 md:grid-cols-3">{['Clarity', 'Integrity', 'Momentum'].map((value) => <div className="card-surface p-6" key={value}><h2 className="text-xl font-bold">{value}</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>We prioritize useful guidance, truthful resume language, and actions users can complete this week.</p></div>)}</div></main><Footer /></>;
}
