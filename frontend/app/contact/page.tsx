import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function ContactPage() {
  return <><Navbar /><main className="container-page py-12"><h1 className="text-5xl font-black">Contact CareerCoach Ai</h1><p className="mt-4 max-w-2xl" style={{ color: 'var(--muted)' }}>Have a question about career planning, partnerships, or the product roadmap? Send a message and the team will respond.</p><form className="card-surface mt-8 grid max-w-2xl gap-4 p-6"><input className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Your name" /><input className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="Email address" type="email" /><textarea className="min-h-36 rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} placeholder="How can we help?" /><button className="btn-primary rounded-2xl px-5 py-3 font-semibold" type="button">Send message</button></form></main><Footer /></>;
}
