import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { fetchBlogs } from '@/lib/api';
import { fallbackBlogs } from '@/lib/data';

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blogs = await fetchBlogs().then((res) => res.data.items).catch(() => fallbackBlogs);
  const blog = blogs.find((item) => item.slug === slug) ?? fallbackBlogs[0];

  return (
    <>
      <Navbar />
      <main className="container-page py-12">
        <Link href="/blog" style={{ color: 'var(--primary)' }}>← Back to blog</Link>
        <article className="mx-auto mt-8 max-w-3xl">
          <p className="font-semibold" style={{ color: 'var(--secondary)' }}>{blog.category} · {blog.readTimeMinutes} min read</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">{blog.title}</h1>
          <div className="mt-8 h-80 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${blog.coverImageUrl})` }} />
          <p className="mt-8 text-lg leading-8" style={{ color: 'var(--muted)' }}>{blog.content}</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
