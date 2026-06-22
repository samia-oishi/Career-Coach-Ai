import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { faqs } from '@/lib/data';

export default function FAQPage() {
  return <><Navbar /><main className="container-page py-12"><h1 className="text-5xl font-black">Frequently Asked Questions</h1><div className="mt-10 grid gap-4">{faqs.map((faq) => <details className="card-surface p-6" key={faq.question}><summary className="cursor-pointer text-lg font-bold">{faq.question}</summary><p className="mt-3" style={{ color: 'var(--muted)' }}>{faq.answer}</p></details>)}</div></main><Footer /></>;
}
