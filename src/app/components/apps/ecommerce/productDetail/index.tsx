"use client";

import { MdCheck } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { ProductContext } from "@/app/context/Ecommercecontext/index";
import { useParams } from "next/navigation";
import { ProductType } from "@/app/(DashboardLayout)/types/apps/eCommerce";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from "next/navigation";


// Reusable RatingStars component (as you used before)
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { products, addToCart } = useContext(ProductContext);
  const { id } = useParams<{ id: string }>();
  const [cartAlert, setCartAlert] = useState(false);
  const router = useRouter();
  const product: ProductType | undefined = products.find(
    (prod) => prod.id === parseInt(id as string)
  );
  const [scolor, setScolor] = useState<string>(
    product ? product.colors[0] : ""
  );
  const [count, setCount] = useState<number>(1);

  const setColor = (color: string) => setScolor(color);

  const handleQuantityChange = (increment: boolean) => {
    setCount((prev) => (increment ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = () => {


    setCartAlert(true);
    setTimeout(() => {
      setCartAlert(false);
    }, 3000);
    if (product) {
      addToCart(product.id);
    }
  };


  const handleBuyNow = async () => {
    if (product) {
      await addToCart(product.id); // add product
      router.push('/apps/ecommerce/checkout'); // go to checkout
    }
  };


  if (!product) return <>No product</>;

  return (
    <>
      <div className="flex gap-2 items-center">
        <Badge variant={product.stock ? "default" : "destructive"}>
          {product.stock ? "In Stock" : "Out of Stock"}
        </Badge>
        <span className="text-xs text-darklink dark:text-bodytext">
          {product.category}
        </span>
      </div>
      <h4 className="text-xl my-2">{product.title}</h4>
      <p className="text-sm text-darklink dark:text-bodytext">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex arcu,
        tincidunt bibendum felis.
      </p>
      <h5 className="text-xl flex gap-2 items-center my-3">
        <span className="text-lg text-muted-foreground line-through font-semibold">
          ${product.salesPrice}
        </span>
        <span className="font-bold text-foreground">${product.price}</span>
      </h5>
      <div className="flex items-center gap-2">
        <RatingStars rating={4} />
        <span className="text-sm text-ld font-medium">(236 reviews)</span>
      </div>
      <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700 my-6" />
      <div className="flex items-center gap-3 mb-8">
        <span className="text-base text-ld font-semibold">Colors:</span>
        <div className="flex items-center gap-2">
          {product.colors.map((color, index) => (
            <div
              key={index}
              className={`h-6 w-6 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center`}
              onClick={() => setColor(color)}
              style={{ backgroundColor: color }}
            >
              {scolor === color && <MdCheck size={16} className="text-white" />}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-base text-ld font-semibold">QTY:</span>
        <div className="flex items-center border border-ld rounded-md">
          <button
            type="button"
            onClick={() => handleQuantityChange(false)}
            className="h-10 w-10 flex items-center justify-center hover:bg-accent"
          >
            <span className="text-xl dark:text-ld">-</span>
          </button>
          <input
            type="text"
            readOnly
            value={count}
            className="w-12 text-center text-ld h-10 border-x border-ld bg-background"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(true)}
            className="h-10 w-10 flex items-center justify-center hover:bg-accent"
          >
            <span className="text-xl dark:text-ld">+</span>
          </button>
        </div>
      </div>
      <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700 my-6" />
      <div className="flex gap-3 items-center mb-6">
        <Button className="px-6" onClick={handleBuyNow}>
          Buy now
        </Button>
        <Button
          variant="destructive"
          className="px-6"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>

      <p className="text-sm text-darklink dark:text-bodytext">
        Dispatched in 2-3 weeks
      </p>
      <Link
        href="#"
        className="text-sm hover:text-primary font-medium  text-dark dark:text-white"
      >
        Why the longer time for delivery?
      </Link>

      {cartAlert && (
        <div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center">
          <Alert variant="primary" className="max-w-sm w-full text-center rounded">
            <AlertDescription>Item Added to the Cart!!!</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
