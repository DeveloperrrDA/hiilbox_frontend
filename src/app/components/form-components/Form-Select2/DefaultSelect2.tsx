"use client";

import React from "react";
import Select from "react-select";
import TitleCard from "@/app/components/shared/TitleBorderCard";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const options = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "superadmin", label: "Super Admin" },
];

const DefaultSelect2 = () => {
  const handleChange = (selectedOption: any) => {
    console.log("Selected:", selectedOption);
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
        borderColor: "var(--color-primary)",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "var(--color-background)",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--color-primary)" // selected option background
        : state.isFocused
        ? "var(--color-lightprimary)" // hovered option background
        : "var(--color-background)", // default background
      color: state.isSelected ? "white" : "inherit",
      cursor: "pointer",
      ":active": {
        backgroundColor: "var(--color-primary)", // darker shade or same as selected
        color: "white",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "var(--color-primary)", // Change this to your desired color
      fontWeight: "600", // Optional: make the text bolder
    }),
  };

  return (
    <TitleCard title="Default Select2">
      <div className="w-full flex flex-col">
        <Label>User Role</Label>
        <Select
          options={options}
          styles={customStyles}
          placeholder="Select role..."
          onChange={handleChange}
        />
      </div>
    </TitleCard>
  );
};

export default DefaultSelect2;
