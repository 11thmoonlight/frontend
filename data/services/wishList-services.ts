"use server";

import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./get-token";
import qs from "qs";

interface StrapiResponse<T> {
  data: T[];
}

const query = qs.stringify({
  populate: {
    products: {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
      },
    },
  },
});

export async function getWishList() {
  const baseUrl = getStrapiURL();

  const url = new URL("/api/wishlists", baseUrl);
  url.search = query;

  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, data: null, error: null };

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-cache",
    });
    const data = await response.json();
    if (data.error) return { ok: false, data: null, error: data.error };
    return { ok: true, data: data, error: null };
  } catch (error) {
    console.log(error);
    return { ok: false, data: null, error: error };
  }
}

export async function getWhishListById(
  id: string
): Promise<StrapiResponse<WhishListItems> | null> {
  const baseUrl = getStrapiURL();

  const url = new URL(`/api/wishlists/${id}`, baseUrl);
  url.search = query;

  const authToken = await getAuthToken();

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-cache",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const addToWishList = async (
  wishListId: string | undefined,
  productId: string | undefined
) => {
  const authToken = await getAuthToken();
  if (!authToken) {
    return { success: false, error: "Authentication token not found" };
  }

  const baseUrl = getStrapiURL();
  const url = new URL(`/api/wishlists/${wishListId}`, baseUrl);

  try {
    const response = await fetch(url.href, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data: {
          products: {
            connect: [{ documentId: productId }],
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error adding book to the wish list");
    }

    await response.json();
  } catch (error) {
    console.error("something went wrong", error);
  }
};

export const removeFromWishList = async (
  wishListId: string | undefined,
  productId: string | undefined
) => {
  const authToken = await getAuthToken();
  if (!authToken) {
    return { success: false, error: "Authentication token not found" };
  }

  const baseUrl = getStrapiURL();
  const url = new URL(`/api/wishlists/${wishListId}`, baseUrl);
  try {
    const response = await fetch(url.href, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        data: {
          products: {
            disconnect: [{ documentId: productId }],
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error deleting book from the cart");
    }

    const updatedWishlist = await response.json();
    console.log("deleting was successful", updatedWishlist);
  } catch (error) {
    console.error("something went wrong", error);
  }
};
