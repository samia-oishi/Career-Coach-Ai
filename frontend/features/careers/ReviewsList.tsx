'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export function ReviewsList({ careerId }: { careerId: string }) {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews', careerId],
    queryFn: async () => {
      const response = await api.get(`/reviews/career/${careerId}`);
      return response.data.data as Review[];
    },
  });

  if (isLoading) {
    return <div className="card-surface p-6 text-center">Loading reviews...</div>;
  }

  if (isError) {
    return <div className="card-surface p-6 text-center text-red-600">Failed to load reviews</div>;
  }

  if (!reviews?.length) {
    return (
      <div className="card-surface p-8 text-center">
        <p style={{ color: 'var(--muted)' }}>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= Math.round(averageRating) ? '' : 'text-gray-300'}>★</span>
            ))}
          </div>
        </div>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>

      {reviews.map((review) => (
        <article key={review._id} className="card-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold">{review.title}</h4>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= review.rating ? '' : 'text-gray-300'}>★</span>
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  {review.user.firstName} {review.user.lastName?.[0]}.
                </span>
              </div>
            </div>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-4" style={{ color: 'var(--muted)' }}>{review.comment}</p>

          {(review.pros.length > 0 || review.cons.length > 0) && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {review.pros.length > 0 && (
                <div>
                  <h5 className="font-semibold text-green-600">Pros</h5>
                  <ul className="mt-2 space-y-1">
                    {review.pros.map((pro, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--muted)' }}>+ {pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons.length > 0 && (
                <div>
                  <h5 className="font-semibold text-red-600">Cons</h5>
                  <ul className="mt-2 space-y-1">
                    {review.cons.map((con, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--muted)' }}>- {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
