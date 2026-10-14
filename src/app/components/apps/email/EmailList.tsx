import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import SimpleBar from "simplebar-react";
import { Icon } from "@iconify/react";
import { EmailContext } from "@/app/context/EmailContext/index";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedItem from "@/app/components/animatedComponents/ListAnimation";

type MailListProps = {
  openMail: Dispatch<SetStateAction<boolean>>;
};

const EmailList = ({ openMail }: MailListProps) => {
  const {
    emails,
    setSelectedEmail,
    deleteEmail,
    filter,
    toggleStar,
    toggleImportant,
    searchQuery,
  } = useContext(EmailContext);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectedEmailId, setSelectedEmailId] = useState(
    emails?.length > 0 ? emails[0].id : null
  );

  const handleCheckboxChange = (emailId: number) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [emailId]: !prevState[emailId],
    }));
  };

  const handleDelete = (emailId: number) => {
    deleteEmail(emailId);
  };

  const filteredEmails = searchQuery
    ? emails?.filter((email: { from: string }) =>
        email.from.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emails?.filter(
        (email: { [x: string]: any; starred: any; label: any }) => {
          if (filter === "starred") {
            return email.starred;
          } else if (
            ["Promotional", "Social", "Health"].includes(filter as string)
          ) {
            return email.label === filter;
          } else {
            return email[filter];
          }
        }
      );

  const handleSelectEmail = (email: any) => {
    setSelectedEmail(email);
    setSelectedEmailId(email.id);
    setCheckedItems({});
  };

  return (
    <>
      <SimpleBar className="max-h-[600px] h-[calc(100vh-100px)]">
        <div className="border-right border-color-divider h-full w-full flex flex-col gap-0.5">
          {filteredEmails?.map((email, index) => (
            <div
              key={email.id}
              className={`cursor-pointer py-4 px-6 gap-3 items-center group bg-hover hover:bg-lighthover dark:hover:bg-darkmuted border-b border-ld  ${
                selectedEmailId === email.id
                  ? "bg-lighthover dark:bg-darkmuted"
                  : ""
              } `}
            >
              <AnimatedItem index={index}>
                <div
                  className="flex gap-3"
                  onClick={() => {
                    handleSelectEmail(email);
                    if (window.innerWidth < 1024) {
                      openMail(true);
                    }
                  }}
                >
                  <Checkbox
                    checked={checkedItems[email.id]}
                    onCheckedChange={() => handleCheckboxChange(email.id)}
                  />
                  <div className="w-full">
                    <div className="flex justify-between">
                      <h6
                        className={`text-sm  ${
                          selectedEmailId === email.id
                            ? "text-primary"
                            : "group-hover:text-primary"
                        }`}
                      >
                        {email.from}
                      </h6>
                      {email.label == "Promotional" ? (
                        <Badge variant={"primary"} className="rounded-md">
                          {email.label}
                        </Badge>
                      ) : email.label == "Social" ? (
                        <Badge variant={"error"} className="rounded-md">
                          {email.label}
                        </Badge>
                      ) : email.label == "Health" ? (
                        <Badge variant={"success"} className="rounded-md">
                          {email.label}
                        </Badge>
                      ) : (
                        <Badge variant={"primary"}>{email.label}</Badge>
                      )}
                    </div>
                    <p className="text-sm line-clamp-1 mt-2 mb-3 text-ld">
                      {email.subject}
                    </p>
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        {email.starred ? (
                          <Icon
                            icon="solar:star-bold"
                            height="16"
                            className="text-warning"
                            onClick={() => toggleStar(email.id)}
                          />
                        ) : (
                          <Icon
                            icon="solar:star-line-duotone"
                            height="16"
                            className="text-ld"
                            onClick={() => toggleStar(email.id)}
                          />
                        )}
                        {email.important ? (
                          <Icon
                            icon="solar:info-circle-bold"
                            height="17"
                            className="text-info"
                            onClick={() => toggleImportant(email.id)}
                          />
                        ) : (
                          <Icon
                            icon="solar:info-circle-outline"
                            height="17"
                            className="text-ld"
                            onClick={() => toggleImportant(email.id)}
                          />
                        )}
                        {checkedItems[email.id] && (
                          <Icon
                            icon="solar:trash-bin-minimalistic-outline"
                            height="17"
                            className="text-dark dark:text-darklink"
                            onClick={() => handleDelete(email.id)}
                          />
                        )}
                      </div>
                      <p className="text-xs text-ld font-medium mt-0.5">
                        {formatDistanceToNowStrict(new Date(email.time), {
                          addSuffix: false,
                        })}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            </div>
          ))}
        </div>
      </SimpleBar>
    </>
  );
};
export default EmailList;
