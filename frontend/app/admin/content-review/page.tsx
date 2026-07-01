'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';

interface Review {
  _id: string;
  title: string;
  comment: string;
  rating: number;
  pros: string[];
  cons: string[];
  isApproved: boolean;
  createdAt: string;
}

export default function ContentReviewPage() {
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [getToken]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await api.get('/admin/content-review', { headers: { Authorization: `Bearer ${token}` } });
      setReviews(response.data.data);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (reviewId: string, isApproved: boolean) => {
    try {
      const token = await getToken();
      await api.patch(`/admin/reviews/${reviewId}/approval`, { isApproved }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchReviews();
    } catch (error) {
      alert('Failed to update review');
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Content Review">
        <div className="card-surface p-8 text-center">Loading pending reviews...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={`Content Review (${reviews.length} pending)`}>
      {reviews.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">All caught up!</h2>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>No reviews pending approval.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <article key={review._id} className="card-surface p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{review.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  Pending
                </span>
              </div>

              <p className="mt-4" style={{ color: 'var(--muted)' }}>{review.comment}</p>

              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {review.pros.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-600">Pros</h4>
                      <ul className="mt-2 space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm" style={{ color: 'var(--muted)' }}>+ {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600">Cons</h4>
                      <ul className="mt-2 space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm" style={{ color: 'var(--muted)' }}>- {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleApproval(review._id, true)}
                  className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(review._id, false)}
                  className="rounded-lg border px-4 py-2 font-semibold transition hover:bg-gray-100"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
