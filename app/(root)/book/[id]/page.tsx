"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useBook } from "@/hooks/useBook";
import StarRating from "@/components/StarRating";
import AddToCartButton from "@/components/AddToCartButton";
import AddToWishlistButton from "@/components/AddToWishlistButton";
import ErrorMessage from "@/components/custom/ErrorMessage";
import Loader from "@/components/custom/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BooksById() {
  const { id } = useParams<{ id: string }>();
  const { book, error, loading } = useBook(id);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-col lg:flex-row gap-10 mt-[160px] mb-10 justify-center px-10 lg:h-[370px] items-center">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div>
            <Image
              src={`http://localhost:1337/${book?.image[0]?.url}`}
              alt="book image cover"
              width={430}
              height={900}
              className="rounded-xl shadow-lg"
            />
          </div>

          <div className="w-fit flex flex-col gap-3 px-6 py-2 shadow-transparent bg-amber-50 rounded-xl md:h-[500px] lg:h-[370px]">
            <h2 className="font-bold text-2xl text-amber-950">{book?.name}</h2>
            <div className="text-lg flex gap-4 items-center">
              <Avatar>
                <AvatarImage
                  src={`http://localhost:1337/${book?.authorImg.url}`}
                  alt="writer image"
                />
                <AvatarFallback>{book?.author}</AvatarFallback>
              </Avatar>
              <p className="text-amber-950">By {book?.author}</p>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={book?.rate ?? 0} />
              <p className="text-amber-950">{book?.rate}</p>
            </div>

            <div
              className="text-sm overflow-y-auto text-amber-950"
              style={{ scrollbarWidth: "none" }}
            >
              {book?.description}
            </div>
          </div>
        </div>

        <Card className="bg-amber-50 w-full md:w-[700px] h-full">
          <CardHeader>
            <CardTitle className="pb-4 text-amber-800 border-b-2">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="font-bold text-amber-800">Publisher</p>
              <p className="text-amber-800">{book?.publisher}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-bold text-amber-800">Publication Date</p>
              <p className="text-amber-800">
                {book?.publicationYear.replaceAll("-", "/")}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="font-bold text-amber-800">Language</p>
              <p className="text-amber-800">{book?.language}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-bold text-amber-800">Pages</p>
              <p className="text-amber-800">{book?.pagesNum}</p>
            </div>

            <div className="flex justify-between">
              <p className="font-bold text-amber-800">Genere</p>
              <p className="text-amber-800">{book?.category}</p>
            </div>

            {book?.discount && book?.discount > 0 && (
              <div className="flex justify-between">
                <p className="font-bold text-amber-800">Discount</p>
                <p className="text-red-700 text-lg font-bold">
                  {book?.discount}$
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <p className="font-bold text-amber-800">Price</p>
              <p className="text-lime-600 text-lg font-bold">{book?.price}$</p>
            </div>
            <div className="flex gap-2">
              <AddToCartButton productId={book?.documentId ?? ""} />
              <AddToWishlistButton productId={book?.documentId ?? ""} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
