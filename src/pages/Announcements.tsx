import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar, AlertTriangle, Info, Star, Loader2 } from "lucide-react";
import { getAnnouncements, asRecordArray, pickStr } from "@/lib/xano";
import { format, parseISO, isValid } from "date-fns";

type Priority = "urgent" | "important" | "general";

function inferPriority(raw: string): Priority {
  const s = raw.toLowerCase();
  if (s.includes("urgent") || s.includes("critical")) return "urgent";
  if (s.includes("important") || s.includes("high")) return "important";
  return "general";
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const iso = parseISO(raw);
  if (isValid(iso)) return format(iso, "MMMM d, yyyy");
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) return format(t, "MMMM d, yyyy");
  return raw;
}

const priorityConfig: Record<
  Priority,
  { icon: typeof AlertTriangle; color: string; bg: string; badge: "default" | "destructive" | "secondary" }
> = {
  urgent: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", badge: "destructive" },
  important: { icon: Star, color: "text-warning", bg: "bg-warning/10", badge: "default" },
  general: { icon: Info, color: "text-info", bg: "bg-info/10", badge: "secondary" },
};

export default function Announcements() {
  const { data: raw, isLoading, isError, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });

  const list = asRecordArray(raw);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10">
          <Megaphone className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground text-sm">Stay updated with the latest notices</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading announcements…
        </div>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message || "Could not load announcements."}
        </p>
      )}

      <div className="space-y-4">
        {list.map((row, i) => {
          const title = pickStr(row, ["title", "subject", "heading", "name"], "Notice");
          const content = pickStr(row, ["content", "body", "message", "description", "text"], "");
          const dateRaw = pickStr(row, ["date", "created_at", "published_at", "updated_at"]);
          const category = pickStr(row, ["category", "tag", "type"], "General");
          const author = pickStr(row, ["author", "posted_by", "from", "department"], "");
          const priRaw = pickStr(row, ["priority", "importance"], "");
          const priority = inferPriority(priRaw);
          const config = priorityConfig[priority];

          return (
            <Card
              key={pickStr(row, ["id"], String(i))}
              className="hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${Math.min(i, 10) * 0.05}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${config.bg} flex-shrink-0 mt-0.5`}>
                    <config.icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{title}</h3>
                      <Badge variant={config.badge} className="text-xs capitalize flex-shrink-0">
                        {priority}
                      </Badge>
                    </div>
                    {content ? (
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">
                        {content}
                      </p>
                    ) : null}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                      {dateRaw ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(dateRaw)}</span>
                        </div>
                      ) : null}
                      <Badge variant="outline" className="text-xs">
                        {category}
                      </Badge>
                      {author ? <span>By {author}</span> : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isLoading && list.length === 0 && !isError && (
        <p className="text-sm text-muted-foreground text-center py-8">No announcements yet.</p>
      )}
    </div>
  );
}
