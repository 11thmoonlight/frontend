import React from "react";
import OrderProcessingChart from "@/components/OrderProcessingChart";
import { Separator } from "@/components/ui/separator";
import { useCartManager } from "@/hooks/useCartManager";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { TabsContent } from "@radix-ui/react-tabs";

interface CurrentOrderTabProps {
  order: OrderItems;
  currentStage: number;
  formattedDate: string;
}

const CurrentOrderTab: React.FC<CurrentOrderTabProps> = ({
  order,
  currentStage,
}) => {
  const { totalPrice, cart, totalItems, discounts } = useCartManager();

  const formattedDate = formatDate(order?.createdAt);

  return (
    <TabsContent
      className="text-center min-h-[250px] rounded-lg border-1 border-2 border-gray-100 border-solid"
      value="current"
    >
      <OrderProcessingChart currentStage={currentStage} />

      <div className="flex flex-col p-7 gap-6">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex flex-col gap-5 w-full bg-stone-50 dark:bg-stone-700 p-5 rounded-lg overflow-x-auto scrollbar-thin">
            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Submission Time:</span>
              <p>{formattedDate}</p>
            </p>
            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Total Cost:</span>
              <span>$ {totalPrice}</span>
            </p>
            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Discount:</span>
              <span>$ {discounts}</span>
            </p>
            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Total Items:</span>
              <span>{totalItems}</span>
            </p>
          </div>

          <div className="flex flex-col gap-5 w-full bg-stone-50 dark:bg-stone-700 p-5 rounded-lg overflow-x-auto scrollbar-thin">
            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Address:</span>
              <span>{order?.address}</span>
            </p>

            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Postal Code:</span>
              <span>{order?.postalCode}</span>
            </p>

            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Email Address:</span>
              <span>{order?.emailAddress}</span>
            </p>

            <p className="flex gap-2 whitespace-nowrap">
              <span className="font-bold">Phone Number:</span>
              <span>{order?.phoneNumber}</span>
            </p>
          </div>
        </div>

        <Separator orientation="horizontal" />

        <div className="flex gap-10 overflow-x-auto scrollbar-thin">
          {cart?.products.map((item) => (
            <div key={item.id}>
              <Image
                src={`http://localhost:1337${item.image[0].url}`}
                alt="book image cover"
                width={80}
                height={80}
              />
            </div>
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default CurrentOrderTab;
