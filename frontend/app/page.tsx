import { HomeLanding } from '@/components/home/HomeLanding';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { fallbackBlogs, fallbackCareers, faqs } from '@/lib/data';
import { fetchBlogs, fetchFeaturedCareers } from '@/lib/api';

export default async function HomePage() {
  const careers = await fetchFeaturedCareers().then((res) => res.data).catch(() => fallbackCareers);
  const blogs = await fetchBlogs().then((res) => res.data.items).catch(() => fallbackBlogs);

  return (
    <>
      <Navbar />
      <HomeLanding blogs={blogs} careers={careers} faqs={faqs} />
      <Footer />
    </>
  );
}
