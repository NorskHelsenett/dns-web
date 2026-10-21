import { Link, useMatchRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Home, Globe, GitBranch, ClipboardClock, Shield, Users, Settings } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/config/routes";
import Logo from "./Logo";
import { t } from "i18next";

type NavItem = { title: string; icon: LucideIcon; to: string; badge?: number };

// TODO: fix routes as pages are implemented
// TODO: fix API call for pending changes number
const main: NavItem[] = [
  { title: t("navbarTitles.myPage"), icon: Home, to: routes.home },
  { title: t("navbarTitles.zones"), icon: Globe, to: routes.zones },
  { title: t("navbarTitles.pendingChanges"), icon: GitBranch, to: "#", badge: 4 },
  { title: t("navbarTitles.auditLog"), icon: ClipboardClock, to: "#" },
];

const admin: NavItem[] = [
  { title: t("navbarTitles.rolesAndPermissions"), icon: Shield, to: "#" },
  { title: t("navbarTitles.accessGroups"), icon: Users, to: "#" },
  { title: t("navbarTitles.settings"), icon: Settings, to: "#" },
];

function NavGroup({ items, label }: { items: NavItem[]; label?: string }) {
  const matchRoute = useMatchRoute();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((el) => (
          <SidebarMenuItem key={el.title}>
            <SidebarMenuButton
              tooltip={el.title}
              isActive={!!matchRoute({ to: el.to, fuzzy: el.to !== "/" })}
              render={<Link to={el.to} />}
            >
              <el.icon />
              <span className="mt-1">{el.title}</span>
            </SidebarMenuButton>
            {el.badge && (
                // text-on-yellow! so it does not become light when hovered
                <SidebarMenuBadge className="mr-1 bg-accent-yellow font-mono font-semibold text-on-yellow!"> 
                    {el.badge}
                </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function Navbar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="box-x-padding py-6">
            <Logo />
        </SidebarHeader>
        <SidebarContent>
            <NavGroup items={main} />
            <NavGroup items={admin} label="Administration" />
        </SidebarContent>
    </Sidebar>
  );
}