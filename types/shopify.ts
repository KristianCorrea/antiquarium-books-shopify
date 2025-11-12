export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: Image | null;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  metafields?: Array<
    | {
        key: string;
        value: string;
      }
    | null
  > | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
};

export type CollectionCard = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: Image | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount?: Money;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      handle: string;
      title: string;
    };
    image?: Image | null;
    priceV2?: Money;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{ node: CartLine }>;
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export type ShopifyResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};
