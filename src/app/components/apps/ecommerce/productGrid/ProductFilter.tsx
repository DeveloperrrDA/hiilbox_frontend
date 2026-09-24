"use client";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useContext } from "react";
import { ProductFiterType } from "../../../../(DashboardLayout)/types/apps/eCommerce";
import { ProductContext } from "@/app/context/Ecommercecontext/index";
import { MdCheck } from "react-icons/md";

const ProductFilter = () => {
  const {
    selectedCategory,
    selectCategory,
    sortBy,
    updateSortBy,
    selectedGender,
    selectGender,
    priceRange,
    updatePriceRange,
    selectedColor,
    selectColor,
    products,
    filterReset,
  } = useContext(ProductContext);

  const filterCategory: ProductFiterType[] = [
    {
      id: 1,
      filterbyTitle: "Filter by Category",
    },
    {
      id: 2,
      name: "All",
      sort: "All",
      icon: "solar:clipboard-list-linear",
    },
    {
      id: 3,
      name: "Fashion",
      sort: "fashion",
      icon: "solar:medal-ribbon-star-linear",
    },
    {
      id: 9,
      name: "Books",
      sort: "books",
      icon: "solar:book-2-outline",
    },
    {
      id: 10,
      name: "Toys",
      sort: "toys",
      icon: "solar:smile-circle-outline",
    },
    {
      id: 11,
      name: "Electronics",
      sort: "electronics",
      icon: "solar:laptop-broken",
    },
    {
      id: 6,
      devider: true,
    },
  ];

  const filterbySort = [
    {
      id: 1,
      value: "newest",
      label: "Newest",
      icon: "solar:presentation-graph-outline",
    },
    {
      id: 2,
      value: "priceDesc",
      label: "Price: High-Low",
      icon: "solar:graph-down-outline",
    },
    {
      id: 3,
      value: "priceAsc",
      label: "Price: Low-High",
      icon: "solar:graph-up-outline",
    },
    {
      id: 4,
      value: "discount",
      label: "Discounted",
      icon: "solar:star-fall-minimalistic-2-broken",
    },
  ];

  const genders = [
    {
      id: 1,
      radioid: "All",
    },
    {
      id: 2,
      radioid: "Men",
    },
    {
      id: 3,
      radioid: "Women",
    },
    {
      id: 4,
      radioid: "Kids",
    },
  ];
  const prices = [
    {
      id: 1,
      lable: "All",
      radioid: "all",
    },
    {
      id: 2,
      lable: "0-50",
      radioid: "0-50",
    },
    {
      id: 3,
      lable: "50-100",
      radioid: "50-100",
    },
    {
      id: 4,
      lable: "100-200",
      radioid: "100-200",
    },
    {
      id: 5,
      lable: "200-99999",
      radioid: "200-99999",
    },
  ];

  const filterbyColors = ["All", ...Array.from(new Set(products.flatMap(p => p.colors)))];

  return (
    <div className="w-full border-e border-ld">
      {/* Category */}
      <ul className="my-4 mt-0 pt-4 flex flex-col gap-1">
        {filterCategory.map(filter => filter.filterbyTitle ? (
          <h6 key={filter.id} className="capitalize text-sm py-4 px-6">
            {filter.filterbyTitle}
          </h6>
        ) : filter.devider ? (
          <div key={filter.id} className="my-4">
            <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700 my-6" />
          </div>
        ) : (
          <li
            key={filter.id}
            className={`flex items-center py-3 gap-2 px-4 hover:bg-muted dark:hover:bg-darkmuted hover:text-primary rounded-md text-ld cursor-pointer mx-6 ${selectedCategory === filter.sort
              ? "text-primary bg-lightprimary hover:bg-lightprimary dark:hover:bg-lightprimary dark:text-primary"
              : ""
              }`}
            onClick={() => selectCategory(filter.sort!)}
          >
            <Icon icon={filter.icon!} height={18} />
            {filter.name}
          </li>
        ))}
      </ul>

      {/* Sort */}
      <ul className="mt-0 px-6 flex flex-col gap-1">
        <h6 className="capitalize text-sm pb-4">Sort By</h6>
        {filterbySort.map(filter => (
          <li
            key={filter.id}
            className={`flex w-full items-center py-3 gap-2 px-4 hover:bg-muted  hover:text-primary dark:hover:bg-darkmuted rounded-md text-ld cursor-pointer ${sortBy === filter.value
              ? "text-primary bg-lightprimary hover:bg-lightprimary dark:hover:bg-lightprimary dark:text-primary"
              : ""
              }`}
            onClick={() => updateSortBy(filter.value)}
          >
            <Icon icon={filter.icon} height={18} />
            {filter.label}
          </li>
        ))}
      </ul>

      <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700 my-6" />

      {/* Gender RadioGroup */}
      <div className="mt-0 px-6">
        <h6 className="capitalize text-sm pb-4">By Gender</h6>

        <RadioGroup
          value={selectedGender}
          onValueChange={(val) => selectGender(val)}
          className="flex flex-col gap-0"
        >
          {genders.map((gen) => {
            return (
              <div
                key={`gender-${gen.id}`}
                className="group py-3 gap-2 hover:bg-muted dark:hover:bg-darkmuted px-4 rounded-md cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    id={gen.radioid}
                    value={gen.radioid}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={gen.radioid}
                    className="cursor-pointer text-ld font-normal text-sm mb-0 group-hover:text-primary dark:group-hover:text-primary"
                  >
                    {gen.radioid}
                  </Label>
                </div>
              </div>

            );
          })}
        </RadioGroup>
      </div>

      <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700 my-6" />

      {/* Pricing RadioGroup */}
      <div className="mt-0 px-6">
        <h6 className="capitalize text-sm pb-4">By Pricing</h6>
        <RadioGroup
          value={priceRange}
          onValueChange={(value: string) => updatePriceRange(value)}
          className="flex flex-col gap-0"
        >
          {prices.map(price => (
            <div key={price.id} className=" group flex py-3  px-4 gap-2  items-center rounded-md hover:bg-muted dark:hover:bg-darkmuted  cursor-pointer">
              <RadioGroupItem value={price.radioid} id={`price-${price.radioid}`} />
              <Label htmlFor={`price-${price.radioid}`} className="cursor-pointer text-ld font-normal text-sm  mb-0 group-hover:text-primary dark:group-hover:text-primary">
                {price.lable}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700 my-6" />

      {/* Colors */}
      <div className="mt-0 px-6 pb-6">
        <h6 className="capitalize text-sm pb-4">By Colors</h6>
        <div className="flex flex-row flex-wrap gap-2 mb-7">
          {filterbyColors.map((theme, idx) => (
            <Label
              key={idx}
              className="h-6 w-6 rounded-full cursor-pointer flex items-center justify-center"
              style={{
                backgroundColor: theme !== "All" ? theme : "#fff",
                border: theme === "All" ? "1px solid #ccc" : "none",
              }}
              onClick={() => selectColor(selectedColor === theme ? "All" : theme)}
            >
              {selectedColor === theme && <MdCheck size={16} className="text-gray-500" />}
            </Label>
          ))}
        </div>

        <Button className="w-full rounded-md" onClick={filterReset}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;
