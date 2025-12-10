export const formatPhone = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");

  let digits = "";

  // Extract just the digits, removing country code prefix if present
  if (cleaned.startsWith("46")) {
    digits = cleaned.slice(2);
  } else if (cleaned.startsWith("0")) {
    digits = cleaned.slice(1);
  } else {
    digits = cleaned;
  }

  // Format to 46XXXXXXXXX (max 9 digits after 46)
  return `46${digits.slice(0, 9)}`;
};

export const phoneRegex = /^(46|0)(\d{1,3})[- ]?\d{6,8}$/;
