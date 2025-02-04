"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { GoHeart } from "react-icons/go";

interface AddToWishlistButtonProps {
  productId: string;
  variant?: "default" | "icon";
}

export default function AddToWishlistButton({
  productId,
  variant = "default",
}: AddToWishlistButtonProps) {
  const { user } = useUser();
  const { addToWishList } = useWishlist(user?.wishlists[0].documentId || "");

  const handleAddToWishlist = async () => {
    try {
      await addToWishList(productId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      onClick={handleAddToWishlist}
      className={cn(
        variant === "default" &&
          "w-full bg-amber-800 text-base hover:bg-amber-700 font-bold text-amber-50",
        variant === "icon" &&
          "bg-wight text-amber-800 hover:shadow-lg hover:bg-white"
      )}
    >
      {variant === "default" ? "Add to wishlist" : <GoHeart size={27} />}
    </Button>
  );
}
