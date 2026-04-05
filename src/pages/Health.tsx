import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartPulse, Thermometer, Droplets, Moon, FileText, Loader2 } from "lucide-react";
import { getHealthLogs, asRecordArray, pickStr } from "@/lib/xano";
import { format, parseISO, isValid } from "date-fns";

function formatLogDate(raw: string): string {
  if (!raw) return "";
  const d = parseISO(raw);
  if (isValid(d)) return format(d, "MMM d, yyyy");
  const t = Date.parse(raw);
  if (!Number.isNaN(t)) return format(t, "MMM d, yyyy");
  return raw;
}

export default function Health() {
  const { data: raw, isLoading, isError, error } = useQuery({
    queryKey: ["health_log"],
    queryFn: getHealthLogs,
  });

  const logs = useMemo(
    () =>
      asRecordArray(raw).sort((a, b) => {
        const da = pickStr(a, ["created_at", "date", "logged_at", "checkup_date"]);
        const db = pickStr(b, ["created_at", "date", "logged_at", "checkup_date"]);
        return (Date.parse(db) || 0) - (Date.parse(da) || 0);
      }),
    [raw]
  );

  const latest = logs[0];

  const healthMetrics = useMemo(() => {
    if (!latest) {
      return [
        { title: "Last checkup", value: "—", icon: HeartPulse, color: "text-info", bg: "bg-info/10" },
        { title: "Temperature", value: "—", icon: Thermometer, color: "text-success", bg: "bg-success/10" },
        { title: "Blood pressure", value: "—", icon: Droplets, color: "text-primary", bg: "bg-primary/10" },
        { title: "Sleep", value: "—", icon: Moon, color: "text-accent", bg: "bg-accent/10" },
      ];
    }
    return [
      {
        title: "Last checkup",
        value: formatLogDate(
          pickStr(latest, ["created_at", "date", "logged_at", "checkup_date"])
        ) || "—",
        icon: HeartPulse,
        color: "text-info",
        bg: "bg-info/10",
      },
      {
        title: "Temperature",
        value:
          pickStr(latest, ["temperature", "temp", "body_temp"], "") ||
          (latest["temperature"] != null ? String(latest["temperature"]) : "—"),
        icon: Thermometer,
        color: "text-success",
        bg: "bg-success/10",
      },
      {
        title: "Blood pressure",
        value: pickStr(latest, ["blood_pressure", "bp", "pressure"], "—"),
        icon: Droplets,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        title: "Sleep",
        value: pickStr(latest, ["sleep", "sleep_hours", "sleep_avg"], "—"),
        icon: Moon,
        color: "text-accent",
        bg: "bg-accent/10",
      },
    ];
  }, [latest]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Health Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">Records from the health center</p>
        </div>
        <Button className="gap-2" type="button" variant="secondary" disabled title="Contact health center to log symptoms">
          <FileText className="h-4 w-4" />
          Log via health center
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading health logs…
        </div>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message || "Could not load health logs."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{metric.title}</p>
                  <p className="text-lg font-bold break-words">{metric.value || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Health log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No health log entries yet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((entry, i) => {
                const status = pickStr(entry, ["status", "condition", "title"], "Entry");
                const notes = pickStr(entry, ["notes", "description", "details"], "");
                const dateRaw = pickStr(entry, ["created_at", "date", "logged_at", "checkup_date"]);
                const type = pickStr(entry, ["type", "category"], "record").toLowerCase();
                const isCheckup =
                  type.includes("check") || type.includes("routine") || type.includes("screen");
                return (
                  <div key={i} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div
                      className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isCheckup ? "bg-success" : "bg-warning"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{status}</span>
                        <Badge variant="outline" className="text-xs">
                          {type || "record"}
                        </Badge>
                      </div>
                      {notes ? (
                        <p className="text-xs text-muted-foreground mt-0.5">{notes}</p>
                      ) : null}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatLogDate(dateRaw) || dateRaw}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
