/**
 * Format a number as currency (supports multiple currencies)
 */
export const formatCurrency = (value: number, currency = 'INR'): string => {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  // Pour les roupies, utiliser le symbole personnalisé
  if (currency === 'INR') {
    return `₹${value.toLocaleString('en-IN', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number as Indian Rupees with smart formatting
 */
export const formatINR = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '₹0';
  
  // Format in millions with M suffix for readability
  if (numValue >= 10000000) { // 10M+
    return `₹${(numValue / 1000000).toFixed(1)}M`;
  }
  // Format in millions with one decimal for 1M-10M
  else if (numValue >= 1000000) { // 1M+
    return `₹${(numValue / 1000000).toFixed(2)}M`;
  }
  // Format in thousands with K suffix for 100K+
  else if (numValue >= 100000) { // 100K+
    return `₹${(numValue / 1000).toFixed(0)}K`;
  }
  // Format in thousands with one decimal for 10K-100K
  else if (numValue >= 10000) { // 10K+
    return `₹${(numValue / 1000).toFixed(1)}K`;
  }
  
  // For smaller amounts, use normal formatting
  return `₹${numValue.toLocaleString('en-IN', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`;
};

/**
 * Format a number with thousand separators (Indian locale)
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';
  
  return numValue.toLocaleString('en-IN');
};

/**
 * Format a decimal number with specified precision
 */
export const formatDecimal = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a percentage
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatDecimal(value, decimals)}%`;
};

/**
 * Format a date to string
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return dateObj.toLocaleDateString('en-US');
  }
};

/**
 * Format time ago in French (e.g., "Il y a 2 heures")
 */
export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInMinutes > 0) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  } else {
    return 'À l\'instant';
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatDecimal(size, unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

/**
 * Convert to title case
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

/**
 * Format chart tooltip value for Indian Rupees
 */
export const formatChartTooltipValue = (value: number): string => {
  return `₹${value.toLocaleString('en-IN')}`;
};

/**
 * Format chart axis values (in thousands/millions for Y-axis)
 */
export const formatChartAxisValue = (value: number): string => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};

/**
 * Format compact number for displaying large values
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format duration in seconds to readable format
 */
export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};
