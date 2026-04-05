import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, TrendingUp, TrendingDown, AlertTriangle, Loader2 } from "lucide-react";
import { getAttendance, asRecordArray, pickStr } from "@/lib/xano";
import { parseAttendanceData } from "@/lib/attendance";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dayIndexFromRecord(rec: Record<string, unknown>): number | null {
  const raw = pickStr(rec, ["date", "created_at", "class_date", "attendance_date", "day"]);
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  const idx = d.getDay();
  return idx === 0 ? 6 : idx - 1;
}

export default function Attendance() {
  const { data: raw, isLoading, isError, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });

  const parsed = useMemo(() => parseAttendanceData(raw), [raw]);
  const records = asRecordArray(raw);

  const weekData = useMemo(() => {
    const counts = weekDays.map(() => ({ classes: 0, attended: 0 }));
    for (const r of records) {
      const di = dayIndexFromRecord(r);
      if (di === null || di < 0 || di > 6) continue;
      counts[di].classes += 1;
      const present = pickStr(r, ["present", "status", "attended_flag"]).toLowerCase();
      const isPresent =
        present === "yes" ||
        present === "true" ||
        present === "1" ||
        present === "present";
      const pct = parsed.subjects.length ? undefined : undefined;
      if (isPresent) counts[di].attended += 1;
      else if (!present) {
        const p = r["percentage"];
        const n = typeof p === "number" ? p : parseFloat(String(p));
        if (!Number.isNaN(n) && n >= 75) counts[di].attended += 1;
      }
    }
    return weekDays.map((day, i) => ({ day, ...counts[i] }));
  }, [records]);

  const hasWeekDates = records.some((r) => dayIndexFromRecord(r) !== null);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>();
    for (const r of records) {
      const raw = pickStr(r, ["date", "created_at", "class_date"]);
      if (!raw) continue;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;
      const key = d.toLocaleString("en", { month: "short" });
      const pct = r["percentage"];
      const val = typeof pct === "number" ? pct : parseFloat(String(pct));
      if (Number.isNaN(val)) continue;
      const cur = map.get(key) || { sum: 0, n: 0 };
      cur.sum += val;
      cur.n += 1;
      map.set(key, cur);
    }
    return [...map.entries()].map(([month, { sum, n }]) => ({
      month,
      percentage: Math.round(sum / n),
    }));
  }, [records]);

  const overallAttendance = parsed.overallPct ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Attendance Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your class attendance across all subjects
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading attendance…
        </div>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message || "Could not load attendance."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-3">
              <span className="text-2xl font-bold text-success">
                {parsed.overallPct !== null ? `${overallAttendance}%` : "—"}
              </span>
            </div>
            <p className="text-sm font-medium">Overall attendance</p>
            <p className="text-xs text-muted-foreground">From your records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-info/10 mb-3">
              <span className="text-2xl font-bold text-info">{parsed.totalAttended || "—"}</span>
            </div>
            <p className="text-sm font-medium">Classes attended</p>
            <p className="text-xs text-muted-foreground">
              {parsed.totalClasses > 0
                ? `Out of ${parsed.totalClasses} total`
                : "Totals when provided by API"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-warning/10 mb-3">
              <span className="text-2xl font-bold text-warning">{parsed.below75}</span>
            </div>
            <p className="text-sm font-medium">Subjects below 75%</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {hasWeekDates && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              By weekday (dated entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {weekData.map((day) => {
                const pct =
                  day.classes > 0 ? Math.round((day.attended / day.classes) * 100) : 0;
                return (
                  <div key={day.day} className="text-center">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
                    <div
                      className={`rounded-xl py-3 px-1 ${
                        day.classes === 0
                          ? "bg-muted/50 border border-border"
                          : pct === 100
                            ? "bg-success/10 border border-success/20"
                            : pct >= 75
                              ? "bg-info/10 border border-info/20"
                              : "bg-destructive/10 border border-destructive/20"
                      }`}
                    >
                      <p className="text-sm font-bold">
                        {day.classes > 0 ? `${day.attended}/${day.classes}` : "—"}
                      </p>
                    </div>
                    {day.classes > 0 ? (
                      <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject-wise breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {parsed.subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attendance rows returned yet.</p>
          ) : (
            <div className="space-y-4">
              {parsed.subjects.map((subject) => {
                const trendUp = subject.percentage >= 75;
                return (
                  <div key={subject.name} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{subject.name}</span>
                        <div className="flex items-center gap-2">
                          {subject.percentage < 75 && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          <Badge
                            variant={subject.percentage >= 75 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {subject.percentage}%
                          </Badge>
                          {trendUp ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                      <Progress
                        value={subject.percentage}
                        className={`h-2 ${
                          subject.percentage < 75 ? "[&>div]:bg-destructive" : "[&>div]:bg-success"
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {subject.attended != null && subject.total != null
                          ? `${subject.attended} / ${subject.total} classes attended`
                          : " "}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly trend (from dated records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-40">
              {monthlyData.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold">{m.percentage}%</span>
                  <div
                    className="w-full rounded-t-lg gradient-primary transition-all duration-500 min-h-[4px]"
                    style={{ height: `${Math.min(100, m.percentage)}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
