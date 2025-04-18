import { useState } from "react";
import {
  getCartItemById,
  getCartItemByIds,
  updateCartItemQuantity,
  addCartItem,
  removeCartItem,
} from "@/data/services/cartItemServices";
import { toast } from "react-toastify";

export function useCartItem(cartId: string) {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCartItemById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCartItemById(id);
      setLoading(false);
      if (result.ok) {
        setCartItem(result.data.data);
        return result.data;
      } else {
        setError(result.error);
        toast.error("Something went wrong");
        return null;
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  const fetchCartItemByIds = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCartItemByIds(cartId, productId);
      setLoading(false);
      if (result.ok) {
        return result.data;
      } else {
        setError(new Error(result.error as string));
        toast.error("Something went wrong");
        return null;
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateCartItemQuantity(cartItemId, newQuantity);
      setLoading(false);
      if (result.ok) {
        return result.data;
      } else {
        setError(result.error);
        toast.error("Something went wrong");
        return null;
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  const addItemToCart = async (productId: string, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addCartItem(cartId, productId, quantity);
      setLoading(false);
      if (result.ok) {
        toast.success("added to your cart");
        return result.data;
      } else {
        setError(result.error);
        toast.error("Something went wrong");
        return null;
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return null;
    }
  };

  const removeItemFromCart = async (cartItemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await removeCartItem(cartItemId);
      setLoading(false);
      if (result.ok) {
        return true;
      } else {
        setError(result.error);
        toast.error("Something went wrong");
        return false;
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return false;
    }
  };

  return {
    cartItem,
    loading,
    error,
    fetchCartItemById,
    fetchCartItemByIds,
    updateQuantity,
    addItemToCart,
    removeItemFromCart,
  };
}
