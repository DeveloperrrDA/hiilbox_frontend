"use client";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Events from "./EventData";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TbCheck } from "react-icons/tb";
import CardBox from "@/app/components/shared/CardBox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { format } from "date-fns";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

type EvType = {
  title: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
};

const CalendarApp = () => {
  const [calevents, setCalEvents] = React.useState<any>(Events);
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [slot, setSlot] = React.useState<EvType>();
  const [start, setStart] = React.useState<any | null>();
  const [end, setEnd] = React.useState<any | null>();
  const [color, setColor] = React.useState<string>("primary");
  const [update, setUpdate] = React.useState<EvType | undefined | any>();

  const ColorVariation = [
    { id: 1, eColor: "primary", value: "primary" },
    { id: 2, eColor: "success", value: "green" },
    { id: 3, eColor: "error", value: "red" },
    { id: 4, eColor: "secondary", value: "default" },
    { id: 5, eColor: "warning", value: "warning" },
  ];

  const addNewEventAlert = (slotInfo: EvType) => {
    setOpen(true);
    setSlot(slotInfo);
    setStart(slotInfo.start);
    setEnd(slotInfo.end);
  };

  const editEvent = (event: any) => {
    setOpen(true);
    const newEditEvent = calevents.find(
      (elem: EvType) => elem.title === event.title
    );
    setColor(event.color);
    setTitle(newEditEvent.title);
    setColor(newEditEvent.color);
    setStart(newEditEvent.start);
    setEnd(newEditEvent.end);
    setUpdate(event);
  };

  const updateEvent = (e: any) => {
    e.preventDefault();
    setCalEvents(
      calevents.map((elem: EvType) => {
        if (elem.title === update.title) {
          return { ...elem, title, start, end, color };
        }
        return elem;
      })
    );
    setOpen(false);
    setTitle("");
    setColor("");
    setStart("");
    setEnd("");
    setUpdate(null);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const selectinputChangeHandler = (id: string) => setColor(id);

  const submitHandler = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const newEvents = [...calevents];
    newEvents.push({
      title,
      start,
      end,
      color,
    });
    setOpen(false);
    e.target.reset();
    setCalEvents(newEvents);
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
  };

  const deleteHandler = (event: EvType) => {
    const updatecalEvents = calevents.filter(
      (ind: EvType) => ind.title !== event.title
    );
    setCalEvents(updatecalEvents);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setUpdate(null);
  };

  const eventColors = (event: EvType) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }
    return { className: `event-default` };
  };

  return (
    <>
      <CardBox>
        <Calendar
          selectable
          events={calevents}
          defaultView="month"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          localizer={localizer}
          onSelectEvent={(event) => editEvent(event)}
          onSelectSlot={(slotInfo: any) => addNewEventAlert(slotInfo)}
          eventPropGetter={(event: any) => eventColors(event)}
          className="min-h-[900px]"
        />
      </CardBox>

      {/* ✅ Shadcn Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={update ? updateEvent : submitHandler}>
            <DialogHeader>
              <DialogTitle>
                {update ? "Update Event" : "Add Event"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {!update
                  ? "To add an event, fill in the title, choose a color, and click Add."
                  : "To update the event, modify the title and color, then click Update."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div>
                <Label htmlFor="event">Event Title</Label>
                <Input
                  id="event"
                  type="text"
                  value={title}
                  onChange={inputChangeHandler}
                  className="mt-1"
                />
              </div>

              {/* Start Date */}
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !start && "text-muted-foreground"
                      )}
                    >
                      {start ? format(start, "PPP") : "Pick a start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={start}
                      onSelect={setStart}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !end && "text-muted-foreground"
                      )}
                    >
                      {end ? format(end, "PPP") : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ShadcnCalendar
                      mode="single"
                      selected={end}
                      onSelect={setEnd}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Event Color */}
            <div className="pt-4">
              <h6 className="text-base font-medium">Select Event Color</h6>
              <div className="flex gap-2 items-center mt-2">
                {ColorVariation.map((mcolor) => (
                  <div
                    key={mcolor.id}
                    className={cn(
                      "h-6 w-6 flex justify-center items-center rounded-full cursor-pointer border border-gray-200",
                      `bg-${mcolor.eColor}`
                    )}
                    onClick={() => selectinputChangeHandler(mcolor.value)}
                  >
                    {mcolor.value === color ? (
                      <TbCheck width="16" className="text-white" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              {update && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteHandler(update)}
                >
                  Delete
                </Button>
              )}
              <Button type="submit" disabled={!title}>
                {update ? "Update Event" : "Add Event"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarApp;
