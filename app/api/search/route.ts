// app/api/search/route.ts (or pages/api/search.ts)
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: { node: { url: string } }[];
  };
}

interface ShopifyResponse {
  products: {
    edges: { node: ShopifyProduct }[];
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) return NextResponse.json({ products: [] });

  try {
    const data: ShopifyResponse = await shopifyFetch({
      query: `
        query PredictiveSearch($q: String!) {
          products(first: 5, query: $q) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { q },
    });

    // Map products and extract first image URL (with fallback)
    const products = data.products?.edges?.map(edge => {
      const node = edge.node;
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        imageUrl: node.images?.edges?.[0]?.node?.url || "/placeholder.png",
      };
    }) || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
