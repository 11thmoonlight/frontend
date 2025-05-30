import { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBooksBySearch } from "@/hooks/useBook";
import { MdHeartBroken } from "react-icons/md";
import { ClipLoader } from "react-spinners";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { books, loading, setBooks } = useBooksBySearch(searchQuery);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setSearchQuery("");
        setBooks([]);
      }
    },
    [setBooks]
  );

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleSelectSuggestion = (documentId: string) => {
    setSearchQuery("");
    setBooks([]);
    router.push(`/book/${documentId}`);
  };

  return (
    <div ref={searchBoxRef} className="relative w-full max-w-md mx-auto">
      <div className="flex justify-between relative">
        <input
          type="text"
          placeholder="Search by Title, Author or Publisher"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full min-w-[300px] 
                     focus:ring-1 focus:ring-amber-200 
                     focus:border-amber-200 outline-none dark:bg-stone-600"
        />
        <button className="block w-7 h-7 text-center text-xl leading-0 absolute top-1 right-1 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors">
          <IoSearchOutline size={20} />
        </button>

        {searchQuery && (
          <ul className="absolute top-full max-h-[400px] left-0 w-full bg-white dark:bg-stone-600 border rounded shadow mt-1 z-50 overflow-y-auto scrollbar-thin">
            {loading ? (
              <li className="p-2 text-gray-500 dark:text-gray-200 text-center flex gap-2 items-center justify-center">
                <ClipLoader size={18} color="#eec211" />
                <p>Searching...</p>
              </li>
            ) : books && books?.length > 0 ? (
              books.map((book: Book) => (
                <li
                  key={book.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-stone-500 cursor-pointer"
                  onClick={() => handleSelectSuggestion(book.documentId)}
                >
                  <div className="flex gap-4">
                    <Image
                      src={`https://backend-production-dd5c.up.railway.app${book?.image[0]?.url}`}
                      width={60}
                      height={10}
                      alt="book's cover"
                      unoptimized
                    />
                    <div className="flex flex-col gap-1">
                      <p>{book.name}</p>
                      <p className="text-gray-600 text-sm dark:text-gray-200">
                        By {book.author}
                      </p>
                      <p className="text-gray-600 text-sm dark:text-gray-200">
                        {book.publisher}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 dark:text-gray-200 text-center flex gap-2 items-center justify-center">
                <p>Not Found</p>
                <MdHeartBroken className="text-amber-600 text-3xl" />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
