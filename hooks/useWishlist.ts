import { useState, useEffect, useCallback } from "react";
import {
  getwishlistById,
  addItemTowishlist,
  removeItemFromwishlist,
} from "@/data/services/wishlistServices";
import { toast } from "react-toastify";

export function useWishlist(wishlistId: string) {
  const [wishlist, setWishlist] = useState<WhishListItems | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const result = await getwishlistById(wishlistId);
        if (result.ok) {
          setWishlist(result.data.data);
          setError(null);
        } else {
          setError(result.error?.message || "Failed to fetch cart.");
          toast.error('Something went wrong')
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to fetch cart.");
      } finally {
        setLoading(false);
      }
    };

    if (wishlistId) {
      fetchWishlist();
    }
  }, [wishlistId]);

  // Add product to wishlist
  const addToWishList = useCallback(
    async (itemId: string) => {
      setLoading(true);
      try {
        const result = await addItemTowishlist(wishlistId, itemId);
        if (result.ok) {
          setWishlist(result.data);
          setError(null);
          toast.success('Successfully added to wishlist')
        } else {
          setError(result.error?.message || "Failed to add item.");
          toast.error('Something went wrong')
        }
      } catch (error) {
        console.error("Error adding item:", error);
        setError("Failed to add item.");
      } finally {
        setLoading(false);
      }
    },
    [wishlistId]
  );

  const removeFromWishlist = useCallback(
    async (itemId: string) => {
      setLoading(true);
      try {
        const result = await removeItemFromwishlist(wishlistId, itemId);
        if (result.ok) {
          setWishlist((prevWishlist) => {
            if (!prevWishlist) return null;
  
            return {
              ...prevWishlist,
              products: prevWishlist.products.filter(
                (product) => product.documentId !== itemId
              ),
            };
          });
          setError(null);
        } else {
          setError(result.error?.message || "Failed to remove item.");
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.error("Error removing item:", error);
        setError("Failed to remove item.");
      } finally {
        setLoading(false);
      }
    },
    [wishlistId]
  );

  return {
    wishlist,
    setWishlist,
    loading,
    error,
    addToWishList,
    removeFromWishlist,
  };
}
