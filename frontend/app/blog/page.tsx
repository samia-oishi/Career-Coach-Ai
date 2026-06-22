import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { fetchBlogs } from '@/lib/api';
import { fallbackBlogs } from '@/lib/data';

export default async function BlogPage() {
  const blogs = await fetchBlogs().then((res) => res.data.items).catch(() => fallbackBlogs);

  return (
    <>
      <Navbar />
      <main className="container-page py-12">
        <p className="font-semibold" style={{ color: 'var(--secondary)' }}>Career guides</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Practical advice for your next move.</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="card-surface block overflow-hidden">
              <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${blog.coverImageUrl})` }} />
              <div className="p-6">
                <p className="text-sm font-semibold" style={{ color: 'var(--secondary)' }}>{blog.category} · {blog.readTimeMinutes} min read</p>
                <h2 className="mt-3 text-2xl font-bold">{blog.title}</h2>
                <p className="mt-3" style={{ color: 'var(--muted)' }}>{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
