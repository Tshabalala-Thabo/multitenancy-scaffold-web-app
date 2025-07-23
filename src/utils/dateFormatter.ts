export interface FormatDateOptions {
  relativeDays?: number; // Show relative time for dates within this many days
  showTime?: boolean;
}

export const formatDate = (dateString: string, options: FormatDateOptions = {}): string => {
  const {
    relativeDays = 7,
    showTime = false,
  } = options;

  const now = new Date();
  const date = new Date(dateString);
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < relativeDays) {
    return formatTimeAgo(date);
  }

  return formatFullDate(date, showTime);
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

const formatFullDate = (date: Date, includeTime: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('en-GB', options);
};

export const formatDateCustom = (dateString: string, relativeDays: number = 7): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < relativeDays) return `${diffInDays} days ago`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
