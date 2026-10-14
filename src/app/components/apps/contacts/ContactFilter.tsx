import React, { useContext, useEffect } from "react";
import { Icon } from "@iconify/react";
import ContactAdd from "./ContactAdd";
import { mutate } from "swr";
import { usePathname } from "next/navigation";
import { ContactContext } from "@/app/context/Conatactcontext";
interface DataType {
  id: number;
  name?: string | any;
  sort?: string;
  icon?: any;
  filterbyTitle?: string;
  devider?: boolean;
  color?: string;
}

const ContactFilter = () => {
  const { setSelectedDepartment, updateSearchTerm, selectedDepartment }: any =
    useContext(ContactContext);
  const filterData: DataType[] = [
    {
      id: 2,
      name: "All",
      sort: "show_all",
      icon: "solar:inbox-unread-outline",
    },
    {
      id: 3,
      name: "Frequent",
      sort: "frequent_contact",
      icon: "solar:map-arrow-square-line-duotone",
    },
    {
      id: 4,
      name: "Starred",
      sort: "starred_contact",
      icon: "solar:cart-broken",
    },
    {
      id: 6,
      devider: true,
    },
    {
      id: 5,
      filterbyTitle: "Categories",
    },

    {
      id: 7,
      name: "Engineering",
      sort: "engineering_department",
      icon: "solar:folder-broken",
      color: "primary",
    },
    {
      id: 8,
      name: "Support",
      sort: "support_department",
      icon: "solar:question-circle-outline",
      color: "error",
    },
    {
      id: 9,
      name: "Sales",
      sort: "sales_department",
      icon: "solar:sale-square-outline",
      color: "success",
    },
  ];

  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department);
    updateSearchTerm("");
  };
  const location = usePathname();

  // Reset Contacts on browser refresh
  const handleResetTickets = async () => {
    const response = await fetch("/api/contacts", {
      method: "GET",
      headers: {
        broserRefreshed: "true",
      },
    });
    const result = await response.json();
    await mutate("/api/contacts");
  };

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    if (isPageRefreshed === "true") {
      console.log("page refreshed");
      sessionStorage.removeItem("isPageRefreshed");
      handleResetTickets();
    }
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isPageRefreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <div className="left-part max-w-[235px] h-full w-full ">
        <ContactAdd />
        <ul className="my-4 flex flex-col gap-0.5">
          {filterData.map((filter) => {
            if (filter.filterbyTitle) {
              return (
                <h6 className="uppercase text-xs pb-3" key={filter.id}>
                  {filter.filterbyTitle}
                </h6>
              );
            } else if (filter.devider) {
              return (
                <div key={filter.id} className="my-4">
                  <hr className="border-border" />
                </div>
              );
            }
            return (
              <li
                key={filter.id}
                className={`flex items-center py-2.5 gap-2 px-4 hover:bg-muted dark:hover:bg-darkmuted hover:text-primary dark:hover:text-primary  rounded-md text-ld cursor-pointer ${
                  selectedDepartment === filter.name
                    ? "!text-primary bg-lighthover dark:bg-darkmuted"
                    : ""
                }`}
                onClick={() => handleDepartmentClick(filter.name)}
              >
                <Icon
                  icon={filter.icon}
                  height={18}
                  className={`text-${filter.color}`}
                />
                {filter.name}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default ContactFilter;
