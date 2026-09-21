"use client";

import React from "react";
import { useContext, useEffect } from "react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { IconCheck, IconSettings } from "@tabler/icons-react";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTheme } from "@teispace/next-themes";

export const Customizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  // Optimized helper functions with memoization
  const addAttributeToDocEle = React.useCallback((cvalue: any) => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-color-theme", cvalue);
    }
  }, []);

  const removeAttributeToDocEle = React.useCallback((attribute: any) => {
    if (typeof window !== "undefined") {
      document.documentElement.removeAttribute(attribute);
    }
  }, []);

  const {
    activeDir,
    setActiveDir,
    activeMode,
    setActiveMode,
    isCollapse,
    setIsCollapse,
    activeTheme,
    setActiveTheme,
    activeLayout,
    setActiveLayout,
    isLayout,
    isCardShadow,
    setIsCardShadow,
    setIsLayout,
    isBorderRadius,
    setIsBorderRadius,
  } = useContext(CustomizerContext);

  const themeColors = [
    {
      id: 1,
      bgColor: "#00A1FF",
      disp: "BLUE_THEME",
    },
    {
      id: 2,
      bgColor: "#0074BA",
      disp: "AQUA_THEME",
    },
    {
      id: 3,
      bgColor: "#763EBD",
      disp: "PURPLE_THEME",
    },
    {
      id: 4,
      bgColor: "#0A7EA4",
      disp: "GREEN_THEME",
    },
    {
      id: 5,
      bgColor: "#01C0C8",
      disp: "CYAN_THEME",
    },
    {
      id: 6,
      bgColor: "#FA896B",
      disp: "ORANGE_THEME",
    },
    {
      id: 7,
      bgColor: "#DA70D6",
      disp: "CUSTOM_THEME",
      isCustom: true,
    },
  ];

  // get value of custom theme color
  const [colorPrimary, setColorPrimary] = useState("#5d87ff");
  const [colorSecondary, setColorSecondary] = useState("#49beff");

  // Helper function to get CSS custom properties
  const getCustomColors = React.useCallback(() => {
    if (typeof window === "undefined")
      return { primary: null, secondary: null };

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      primary: computedStyle.getPropertyValue("--color-primary").trim() || null,
      secondary:
        computedStyle.getPropertyValue("--color-secondary").trim() || null,
    };
  }, []);

  // Update colors from CSS custom properties
  const updateColorsFromCSS = React.useCallback(() => {
    const colors = getCustomColors();

    if (colors.primary) {
      setColorPrimary(colors.primary);
    }
    if (colors.secondary) {
      setColorSecondary(colors.secondary);
    }
  }, [getCustomColors]);

  // Get initial colors on component mount and when theme changes
  useEffect(() => {
    updateColorsFromCSS();
  }, [updateColorsFromCSS, activeTheme]);

  // Optimized color change handlers
  const handlePrimaryColorChange = React.useCallback((value: string) => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--color-primary", value);
    }
    setColorPrimary(value);
  }, []);

  const handleSecondaryColorChange = React.useCallback((value: string) => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--color-secondary", value);
    }
    setColorSecondary(value);
  }, []);

  // Optimized function to remove custom color properties
  const removeCustomColorProperties = React.useCallback(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement.style;
      root.removeProperty("--color-primary");
      root.removeProperty("--color-secondary");
    }
  }, []);

  // Keep activeMode synced with the real applied theme
  const { theme, systemTheme } = useTheme();
  useEffect(() => {
    // If theme = "system", reflect the *actual* system theme
    if (theme === "system") {
      setActiveMode(systemTheme || "light");
    } else {
      setActiveMode(theme);
    }
  }, [theme, systemTheme]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <SheetTrigger className="cursor-pointer" asChild>
          <Button
            className="h-14 w-14 fixed bottom-6 end-6 z-20 text-2xl block"
            shape={"pill"}
            onClick={() => setIsOpen(true)}
          >
            <IconSettings className="w-full! h-full!" />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent
        side={activeDir === "rtl" ? "left" : "right"}
        className="  dark:bg-dark w-full max-w-[350px] sm:max-w-[350px] border-ld"
      >
        <VisuallyHidden>
          <SheetTitle>customizer</SheetTitle>
        </VisuallyHidden>
        <SheetHeader>
          <div className="border-ld  border-b">
            <div className="flex justify-between items-center p-4">
              <h5 className="text-xl">Settings</h5>

              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="[&_svg]:size-6 text-dark dark:text-white"
              >
                {/* × or  */}
                <Icon icon="ic:round-close" className="" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <SimpleBar className="h-n80">
          <div className="p-4">
            {/* Theme Option */}
            <h4 className="text-base mb-2">Theme Option</h4>
            <div className="flex gap-4 mb-7">
              <Button
                color={"primary"}
                className={`border bg-transparent text-darklink btn-shadow border-ld  dark:text-white hover:bg-lightprimary hover:text-primary rounded-md  dark:hover:text-white  py-3 h-15 px-6 
                              ${
                                activeMode === "light"
                                  ? "active text-primary bg-lightprimary border-none"
                                  : ""
                              }`}
                onClick={() => {
                  setActiveMode("light");
                }}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:sun-bold-duotone"
                    width="20"
                    className="me-2"
                  />
                  Light
                </span>
              </Button>
              <Button
                color={"primary"}
                className={`border bg-transparent dark:text-white border-ld text-darklink hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6  ${
                  activeMode === "dark"
                    ? "active text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => {
                  setActiveMode("dark");
                }}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:moon-bold-duotone"
                    width="20"
                    className="me-2"
                  />{" "}
                  Dark
                </span>
              </Button>
            </div>

            {/* Theme direction */}
            <h4 className="text-base mb-2">Theme Direction</h4>
            <div className="flex gap-4 mb-7">
              <Button
                color={"primary"}
                className={`  border bg-transparent text-darklink dark:text-white border-ld  hover:bg-lightprimary hover:text-primary rounded-md  py-3 h-15 px-6  dark:hover:text-white ${
                  activeDir === "ltr"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => {
                  setActiveDir("ltr");
                }}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:align-left-line-duotone"
                    width="20"
                    className="me-2"
                  />{" "}
                  LTR
                </span>
              </Button>
              <Button
                color={"primary"}
                className={`  border bg-transparent btn-shadow border-ld text-darklink dark:text-white hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6  ${
                  activeDir === "rtl"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => {
                  setActiveDir("rtl");
                }}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:align-right-line-duotone"
                    width="20"
                    className="me-2"
                  />{" "}
                  RTL
                </span>
              </Button>
            </div>

            {/* Theme Colors */}
            <h4 className="text-base mb-2">Theme Colors</h4>

            <div className="flex flex-row flex-wrap  gap-4 mb-7">
              {themeColors.slice(0, 6).map((theme) => (
                <span
                  key={theme.id}
                  onClick={() => {
                    if (!theme.isCustom) {
                      addAttributeToDocEle(theme.disp);
                      setActiveTheme(theme.disp);

                      removeCustomColorProperties();
                    } else {
                      removeAttributeToDocEle("data-color-theme");
                      setActiveTheme("CUSTOM_THEME");
                    }
                  }}
                  className="border bg-transparent hover:!bg-transparent text-link border-ld py-5 px-6 rounded-md cursor-pointer"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <label
                          className="h-6 w-6 rounded-full cursor-pointer flex items-center justify-center"
                          style={{
                            background: theme.isCustom
                              ? "linear-gradient(to bottom, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)"
                              : theme.bgColor,
                          }}
                        >
                          {activeTheme === theme.disp && (
                            <IconCheck className="text-white" size={18} />
                          )}
                        </label>
                      </TooltipTrigger>
                      <TooltipContent>{theme.disp}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              ))}
            </div>

            {/* Theme layout */}
            <h4 className="text-base mb-2">Layout Type</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                color={"primary"}
                className={`border bg-transparent btn-shadow border-ld text-darklink dark:text-white hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6   dark:hover:text-white ${
                  activeLayout === "vertical"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => setActiveLayout("vertical")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:slider-vertical-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Vertical
                </span>
              </Button>
              <Button
                color={"primary"}
                onClick={() => setActiveLayout("horizontal")}
                className={`border bg-transparent  dark:text-white border-ld text-darklink hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6  ${
                  activeLayout === "horizontal"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:slider-horizontal-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Horizontal
                </span>
              </Button>
            </div>

            {/* Sidebar Type */}
            <h4 className="text-base mb-2">Container Option</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                color={"primary"}
                className={`border bg-transparent btn-shadow border-ld text-darklink dark:text-white hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6   dark:hover:text-white ${
                  isLayout === "boxed"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => setIsLayout("boxed")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:quit-full-screen-square-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Boxed
                </span>
              </Button>
              <Button
                color={"primary"}
                className={`border bg-transparent  dark:text-white border-ld text-darklink hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6 ${
                  isLayout === "full"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => setIsLayout("full")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:full-screen-square-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Full
                </span>
              </Button>
            </div>

            {/* Sidebar Type */}
            <h4 className="text-base mb-2">Sidebar Type</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                color={"primary"}
                className={`border bg-transparent btn-shadow border-ld text-darklink dark:text-white hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6   dark:hover:text-white ${
                  isCollapse == "full-sidebar"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => setIsCollapse("full-sidebar")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:mirror-left-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Full
                </span>
              </Button>
              <Button
                color={"primary"}
                className={`border bg-transparent  dark:text-white border-ld text-darklink hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6  ${
                  isCollapse == "mini-sidebar"
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => setIsCollapse("mini-sidebar")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:mirror-right-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Collapse
                </span>
              </Button>
            </div>

            {/* Card  With */}
            <h4 className="text-base mb-2">Card With</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                color={"primary"}
                className={`border bg-transparent btn-shadow border-ld text-darklink dark:text-white hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6   ${
                  !isCardShadow
                    ? "text-primary bg-lightprimary border-none"
                    : ""
                }`}
                onClick={() => setIsCardShadow(false)}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:three-squares-line-duotone"
                    width="20"
                    className="me-2"
                  />
                  Border
                </span>
              </Button>
              <Button
                color={"primary"}
                className={`border bg-transparent dark:text-white border-ld text-darklink hover:bg-lightprimary hover:text-primary rounded-md py-3 h-15 px-6  dark:hover:text-white ${
                  isCardShadow ? "text-primary bg-lightprimary border-none" : ""
                }`}
                onClick={() => setIsCardShadow(true)}
              >
                <span className="flex items-center">
                  <Icon
                    icon="solar:three-squares-bold-duotone"
                    width="20"
                    className="me-2"
                  />
                  Shadow
                </span>
              </Button>
            </div>

            {/* Card  With */}
            <h4 className="text-base mb-2">Theme Border Radius</h4>
            <Slider
              defaultValue={[isBorderRadius]}
              value={[isBorderRadius]}
              onValueChange={([value]) => setIsBorderRadius(value)}
              min={4}
              max={24}
              step={1}
            />
            <div>Current Value: {isBorderRadius}</div>
          </div>
        </SimpleBar>
      </SheetContent>
    </Sheet>
  );
};
