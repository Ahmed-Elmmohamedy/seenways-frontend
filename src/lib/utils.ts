export const colorMap: Record<string, string> = {
  "أسود": "#000000", "أبيض": "#FFFFFF", "رمادي": "#9ca3af",
  "بيج": "#d4b896", "كحلي": "#1e3a5f", "بني": "#8B4513",
  "أخضر زيتي": "#556B2F", "أحمر": "#dc2626", "أزرق": "#3b82f6",
  "black": "#000000", "white": "#FFFFFF", "gray": "#9ca3af",
  "beige": "#d4b896", "navy": "#1e3a5f", "brown": "#8B4513",
  "olive": "#556B2F", "red": "#dc2626", "blue": "#3b82f6",
  "green": "#22c55e", "yellow": "#eab308", "orange": "#f97316",
  "pink": "#ec4899", "purple": "#a855f7", "cream": "#f5f0e8",
  "camel": "#c19a6b", "sand": "#c2b280", "khaki": "#c3b091",
};

export const statusAr: Record<string, string> = {
  PENDING: "انتظار", CONFIRMED: "مؤكد", PROCESSING: "جاري التحضير",
  SHIPPED: "تم الشحن", DELIVERED: "تم التسليم", CANCELLED: "ملغي",
};

export const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("ar-EG")} ج.م`;
}

// Security: Honeypot + Rate limiting helpers
export function detectBot(formData: Record<string, string>): boolean {
  if (formData._honeypot && formData._honeypot !== "") return true;
  if (formData.website && formData.website !== "") return true;
  return false;
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return /^(\+?20|0)?1[0125]\d{8}$/.test(cleaned);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const submitTimes: number[] = [];
export function isRateLimited(): boolean {
  const now = Date.now();
  const recent = submitTimes.filter(t => now - t < 60000);
  if (recent.length >= 3) return true;
  submitTimes.push(now);
  return false;
}
