// Meta Pixel Helper Functions
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const FB_PIXEL_ID = '875798924620131';

// Track Page View
export const pageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track View Content (Product Page)
export const viewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'EGP',
      content_category: product.category || 'Menswear',
    });
  }
};

// Track Add To Cart
export const addToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [item.id],
      content_name: item.name,
      content_type: 'product',
      value: item.price * item.quantity,
      currency: 'EGP',
      num_items: item.quantity,
    });
  }
};

// Track Initiate Checkout
export const initiateCheckout = (data: {
  total: number;
  numItems: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: data.total,
      currency: 'EGP',
      num_items: data.numItems,
    });
  }
};

// Track Purchase
export const purchase = (data: {
  orderNumber: string;
  total: number;
  items: { id: string; name: string; price: number; quantity: number }[];
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: data.items.map(i => i.id),
      content_type: 'product',
      value: data.total,
      currency: 'EGP',
      num_items: data.items.reduce((sum, i) => sum + i.quantity, 0),
      order_id: data.orderNumber,
    });
  }
};

// Track Search
export const search = (query: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: query,
    });
  }
};
