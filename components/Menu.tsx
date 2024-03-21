"use client";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { ClipboardCheck } from "lucide-react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import ModeToggle from "./toggle";

export default function Menu() {
  return (
    <NavigationMenu className="ms-3 mt-3 mb-3">
      <NavigationMenuList>
        <NavigationMenuItem className="me-5">
        <ClipboardCheck />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
