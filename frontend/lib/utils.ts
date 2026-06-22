export const formatSalary = (min: number, max: number) => {
  const compact = Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  return `${compact.format(min)} - ${compact.format(max)}`;
};

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
