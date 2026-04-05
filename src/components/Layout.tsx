import { Link, Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, ChevronRight, Loader2, LogOut, User, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { pickStr, getAnnouncements, asRecordArray } from "@/lib/xano";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isValid, parseISO } from "date-fns";

function initialsFromUser(user: Record<string, unknown> | null): string {
  if (!user) return "?";
  const name = pickStr(user, ["name", "full_name", "display_name", "student_name"]);
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const email = pickStr(user, ["email"]);
  if (email) return email.slice(0, 2).toUpperCase();
  return "ME";
}

function formatAnnDate(raw: string): string {
  if (!raw) return "";
  const iso = parseISO(raw);
  if (isValid(iso)) return format(iso, "MMM d, yyyy");
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) return format(t, "MMM d, yyyy");
  return raw;
}

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: announcementsRaw, isLoading, isError } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });
  const announcements = asRecordArray(announcementsRaw);
  const noticeCount = announcements.length;
  const initials = initialsFromUser(user);

  const displayName = pickStr(user || {}, ["name", "full_name", "display_name", "student_name"], "Student");
  const email = pickStr(user || {}, ["email"], "");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                VIT Bhopal Student Portal
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative shrink-0" type="button" title="Notifications">
                    <Bell className="h-4 w-4" />
                    {noticeCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-h-4 min-w-4 px-0.5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">
                        {noticeCount > 99 ? "99+" : noticeCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[min(100vw-2rem,22rem)] p-0">
                  <div className="px-3 py-2 border-b bg-muted/40">
                    <p className="text-sm font-semibold">Announcements</p>
                    <p className="text-xs text-muted-foreground">From the institute</p>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </div>
                  ) : isError ? (
                    <p className="px-3 py-6 text-sm text-destructive text-center">Could not load announcements.</p>
                  ) : announcements.length === 0 ? (
                    <p className="px-3 py-6 text-sm text-muted-foreground text-center">No announcements yet.</p>
                  ) : (
                    <ScrollArea className="h-[min(70vh,320px)]">
                      <div className="p-1">
                        {announcements.map((row, i) => {
                          const title = pickStr(
                            row,
                            ["title", "subject", "heading", "name"],
                            "Notice"
                          );
                          const content = pickStr(
                            row,
                            ["content", "body", "message", "description", "text"],
                            ""
                          );
                          const dateRaw = pickStr(row, [
                            "date",
                            "created_at",
                            "published_at",
                            "updated_at",
                          ]);
                          return (
                            <div
                              key={pickStr(row, ["id"], String(i))}
                              className="rounded-md px-2 py-2.5 text-left hover:bg-accent/60"
                            >
                              <p className="text-sm font-medium leading-snug line-clamp-2">{title}</p>
                              {content ? (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{content}</p>
                              ) : null}
                              {dateRaw ? (
                                <p className="text-[10px] text-muted-foreground mt-1">{formatAnnDate(dateRaw)}</p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                  <div className="border-t p-1">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/announcements" className="flex w-full items-center justify-between">
                        View all announcements
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full shrink-0 h-9 w-9"
                    type="button"
                    title="Account menu"
                  >
                    <span className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {initials}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1 py-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      {email ? (
                        <p className="text-xs text-muted-foreground leading-snug break-all">{email}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">No email on file</p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    My profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
