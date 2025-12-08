import 'server-only';

import type { Cart, CollectionCard, ProductCard, ProductVariant, ShopifyResponse } from '@/types/shopify';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = domain && apiVersion ? `https://${domain}/api/${apiVersion}/graphql.json` : null;

type GraphQLParams = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
};

async function shopifyFetch<T>({ query, variables, cache, next }: GraphQLParams) {
  if (!endpoint || !accessToken) {
    throw new Error('Missing Shopify environment variables.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken
    },
    body: JSON.stringify({ query, variables }),
    ...(cache && { cache }),
    next
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.statusText}`);
  }

  const payload = (await response.json()) as ShopifyResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join('\n'));
  }

  if (!payload.data) {
    throw new Error('Shopify response missing data');
  }

  return payload.data;
}

const PRODUCT_CARD = `
  fragment ProductCard on Product {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    metafields(identifiers: [
      { namespace: "details", key: "author" },
      { namespace: "details", key: "year" },
      { namespace: "details", key: "condition" },
      { namespace: "details", key: "signed" }
    ]) {
      key
      value
    }
  }
`;

const COLLECTION_CARD = `
  fragment CollectionCard on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 25) {
      edges {
        node {
          id
          quantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
                width
                height
              }
              product {
                handle
                title
              }
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function getFeaturedContent() {
  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: CollectionCard }> };
    products: { edges: Array<{ node: ProductCard }> };
  }>({
    query: `
      ${PRODUCT_CARD}
      ${COLLECTION_CARD}
      query FeaturedContent {
        collections(first: 15, sortKey: UPDATED_AT) {
          edges {
            node {
              ...CollectionCard
            }
          }
        }
        products(first: 8, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              ...ProductCard
            }
          }
        }
      }
    `,
    next: { revalidate: 300, tags: ['collections', 'products'] }
  });

  return {
    collections: data.collections.edges.map((edge) => edge.node),
    products: data.products.edges.map((edge) => edge.node)
  };
}



export async function getCollections(limit = 12) {
  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: CollectionCard }> };
  }>({
    query: `
      ${COLLECTION_CARD}
      query Collections($limit: Int!) {
        collections(first: $limit, sortKey: TITLE) {
          edges {
            node {
              ...CollectionCard
            }
          }
        }
      }
    `,
    variables: { limit },
    next: { revalidate: 300, tags: ['collections'] }
  });

  return data.collections.edges.map(({ node }) => node);
}

export async function getCollectionByHandle(handle: string, cursor?: string) {
  const data = await shopifyFetch<{
    collection: CollectionCard & {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor?: string | null };
        edges: Array<{ node: ProductCard }>;
      };
    };
  }>({
    query: `
      ${PRODUCT_CARD}
      query CollectionByHandle($handle: String!, $cursor: String) {
        collection(handle: $handle) {
          id
          handle
          title
          description
          image {
            url
            altText
          }
          products(first: 12, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                ...ProductCard
              }
            }
          }
        }
      }
    `,
    variables: { handle, cursor },
    cache: 'no-store'
  });

  return data.collection;
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<{
    product: ProductCard & {
      descriptionHtml: string;
      seo?: { title?: string | null; description?: string | null } | null;
      media: {
        edges: Array<{
          node: {
            mediaContentType: string;
            alt?: string | null;
            image?: { url: string; altText?: string | null; width?: number | null; height?: number | null } | null;
          };
        }>;
      };
      variants: {
        nodes: Array<ProductVariant>;
      };
    };
  }>({
    query: `
      ${PRODUCT_CARD}
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          ...ProductCard
          descriptionHtml
          seo {
            title
            description
          }
          media(first: 20) {
            edges {
              node {
                ... on MediaImage {
                  mediaContentType
                  alt
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
          variants(first: 25) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `,
    variables: { handle },
    cache: 'no-store'
  });

  return data.product;
}

export async function predictiveSearch(query: string) {
  const data = await shopifyFetch<{
    predictiveSearch: {
      products: Array<ProductCard>;
      collections: Array<CollectionCard>;
    };
  }>({
    query: `
      ${PRODUCT_CARD}
      ${COLLECTION_CARD}
      query PredictiveSearch($query: String!) {
        predictiveSearch(query: $query, limit: 6) {
          products {
            ...ProductCard
          }
          collections {
            ...CollectionCard
          }
        }
      }
    `,
    variables: { query },
    cache: 'no-store'
  });

  return data.predictiveSearch;
}

export async function searchProducts(query: string, cursor?: string) {
  const data = await shopifyFetch<{
    search: {
      edges: Array<{ cursor: string; node: ProductCard }>;
      pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    };
  }>({
    query: `
      ${PRODUCT_CARD}
      query ProductSearch($query: String!, $cursor: String) {
        search(query: $query, first: 12, after: $cursor, types: PRODUCT) {
          edges {
            cursor
            node {
              ... on Product {
                ...ProductCard
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables: { query, cursor },
    cache: 'no-store'
  });

  return {
    nodes: data.search.edges.map(({ node }) => node),
    pageInfo: data.search.pageInfo
  };
}

export async function cartCreate() {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartCreate {
        cartCreate {
          cart {
            ...CartFragment
          }
        }
      }
    `,
    cache: 'no-store'
  });

  return data.cartCreate.cart;
}

export async function cartQuery(cartId: string) {
  const data = await shopifyFetch<{ cart: Cart }>({
    query: `
      ${CART_FRAGMENT}
      query CartQuery($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFragment
        }
      }
    `,
    variables: { cartId },
    cache: 'no-store'
  });

  return data.cart;
}

export async function cartLinesAdd(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFragment
          }
        }
      }
    `,
    variables: { cartId, lines },
    cache: 'no-store'
  });

  return data.cartLinesAdd.cart;
}

export async function cartLinesUpdate(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFragment
          }
        }
      }
    `,
    variables: { cartId, lines },
    cache: 'no-store'
  });

  return data.cartLinesUpdate.cart;
}

export async function cartLinesRemove(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFragment
          }
        }
      }
    `,
    variables: { cartId, lineIds },
    cache: 'no-store'
  });

  return data.cartLinesRemove.cart;
}

export { shopifyFetch };


