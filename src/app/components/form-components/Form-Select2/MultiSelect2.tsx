"use client";

import React from "react";
import Select from "react-select";
import TitleCard from "@/app/components/shared/TitleBorderCard";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const options = [
  { value: "dashboard", label: "Dashboard" },
  { value: "users", label: "Users" },
  { value: "settings", label: "Settings" },
  { value: "analytics", label: "Analytics" },
  { value: "support", label: "Support" },
];

const MultiSelect2 = () => {
  const handleChange = (selectedOptions: any) => {
    console.log("Selected:", selectedOptions);
  };

  const { theme } = useTheme();

  const borderColor = theme === "dark" ? " #333f55" : "#e0e6eb";

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor,
      minHeight: "38px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "var(--color-primary)", // gray-400
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "var(--color-lightprimary)", // blue-100
      color: "var(--color-primary)", // blue-600
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "var(--color-primary)", // blue-700
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "var(--color-primary)",
      ":hover": {
        backgroundColor: "var(--color-lightprimary)",
        color: "var(--color-primary)",
      },
    }),
    option: (base: any, state: { isFocused: any }) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "var(--color-lightprimary)"
        : "var(--color-background)",
      borderColor: "var(--color-primary)",
      cursor: "pointer",
      ":active": {
        backgroundColor: "var(--color-primary)", // darker shade or same as selected
        color: "white",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "var(--color-background)",
    }),
  };

  return (
    <TitleCard title="Multi Select2">
      <div className="w-full flex flex-col">
        <Label>Select Permissions</Label>
        <Select
          options={options}
          isMulti
          styles={customStyles}
          placeholder="Select permissions..."
          onChange={handleChange}
          closeMenuOnSelect={false}
        />
      </div>
    </TitleCard>
  );
};

export default MultiSelect2;
