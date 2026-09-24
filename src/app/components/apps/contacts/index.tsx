"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ContactFilter from "./ContactFilter";
import ContactSearch from "./ContactSearch";
import ContactList from "./ContactList";
import ContactListItem from "./ContactListItem";
import { ContactContextProvider } from "@/app/context/Conatactcontext";

const index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [isOpenContact, setIsOpenContact] = useState(false);

  return (
    <>
      <ContactContextProvider>
        <Card className="p-0 overflow-hidden bg-white dark:bg-darkgray">
          <div className="flex h-[calc(100vh-300px)]">
            {/* ------------------------------------------- */}
            {/* Left Part */}
            {/* ------------------------------------------- */}
            <Sheet open={isOpen} onOpenChange={handleClose}>
              <SheetContent
                side="left"
                className="max-w-[230px] sm:max-w-[230px] w-full h-full lg:z-0 lg:hidden block"
              >
                <ContactFilter />
              </SheetContent>
            </Sheet>
            <div className="max-w-[230px] sm:max-w-[230px] w-full h-auto lg:block hidden">
              <ContactFilter />
            </div>

            {/* ------------------------------------------- */}
            {/* Middle part */}
            {/* ------------------------------------------- */}
            <div className="left-part lg:max-w-[340px] max-w-full lg:border-e lg:border-ld border-e-0  w-full px-0 pt-0">
              <ContactSearch onClick={() => setIsOpen(true)} />
              <ContactList openContact={setIsOpenContact} />
            </div>

            {/* ------------------------------------------- */}
            {/* Detail part */}
            {/* ------------------------------------------- */}
            <ContactListItem
              openContactValue={isOpenContact}
              onCloseContact={() => setIsOpenContact(false)}
            />
          </div>
        </Card>
      </ContactContextProvider>
    </>
  );
};

export default index;
