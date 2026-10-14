"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {DropdownMenu,DropdownMenuCheckboxItem,DropdownMenuContent,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Icon} from "@iconify/react";
export default function ColumnVisibilityControl({tableClass,columns}:{tableClass:string;columns:string[]}){const[shown,setShown]=useState(()=>columns.map(()=>true));const hiddenCss=shown.map((on,i)=>on?"":`.${tableClass} th:nth-child(${i+1}),.${tableClass} td:nth-child(${i+1}){display:none!important;}`).join("");return <><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Icon icon="solar:settings-minimalistic-line-duotone"/> Show/Hide Columns</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Columns</DropdownMenuLabel><DropdownMenuSeparator/>{columns.map((label,i)=><DropdownMenuCheckboxItem key={`${label}-${i}`} checked={shown[i]} onCheckedChange={v=>setShown(x=>x.map((item,index)=>index===i?Boolean(v):item))}>{label}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>{hiddenCss&&<style>{hiddenCss}</style>}</>}
