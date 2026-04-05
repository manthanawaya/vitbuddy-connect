import { CalendarCheck, HeartPulse, Building2, Megaphone, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
  asRecordArray,
  getAnnouncements,
  getAttendance,
  getHealthLogs,
  pickNum,
  pickStr,
} from "@/lib/xano";
import { parseAttendanceData } from "@/lib/attendance";
import { formatDistanceToNow } from "date-fns";

function parseTimeMs(rec: Record<string, unknown>): number {
  const raw = pickStr(rec, [
    "created_at",
    "date",
    "updated_at",
    "logged_at",
    "checkup_date",
    "recorded_at",
  ]);
  if (!raw) return 0;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? 0 : t;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: attendanceRaw, isLoading: loadAtt } = useQuery({
    queryKey: ["attendance"],
    queryFn: getAttendance,
  });
  const { data: healthRaw, isLoading: loadHealth } = useQuery({
    queryKey: ["health_log"],
    queryFn: getHealthLogs,
  });
  const { data: announcementsRaw, isLoading: loadAnn } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });

  const att = parseAttendanceData(attendanceRaw);
  const healthLogs = asRecordArray(healthRaw).sort(
    (a, b) => parseTimeMs(b) - parseTimeMs(a)
  );
  const announcements = asRecordArray(announcementsRaw);

  const displayName = pickStr(user || {}, ["name", "full_name", "display_name"], "Student");
  const room = pickStr(user || {}, ["room", "room_number", "hostel_room", "room_no"]);
  const hostel = pickStr(user || {}, ["hostel", "hostel_block", "block"]);

  const latestHealth = healthLogs[0];
  const healthLabel = latestHealth
    ? pickStr(latestHealth, ["status", "condition", "title", "notes"], "Recorded")
    : "—";
  const healthSub = latestHealth
    ? pickStr(latestHealth, ["notes", "description", "detail"], "")
    : "No health logs yet";

  const overallStr =
    att.overallPct !== null ? `${att.overallPct}%` : loadAtt ? "…" : "—";

  const stats = [
    {
      title: "Attendance",
      value: overallStr,
      subtitle: att.overallPct !== null ? "Based on your records" : "No attendance data",
      icon: CalendarCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Health status",
      value: healthLabel.length > 18 ? `${healthLabel.slice(0, 16)}…` : healthLabel,
      subtitle: healthSub ? healthSub.slice(0, 40) + (healthSub.length > 40 ? "…" : "") : "—",
      icon: HeartPulse,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Room",
      value: room || "—",
      subtitle: hostel || "Hostel",
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Notices",
      value: loadAnn ? "…" : String(announcements.length),
      subtitle: "Announcements",
      icon: Megaphone,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  type Act = { icon: typeof CheckCircle2; text: string; time: string; color: string; ms: number };
  const activities: Act[] = [];

  for (const h of healthLogs.slice(0, 5)) {
    const ms = parseTimeMs(h);
    const status = pickStr(h, ["status", "condition", "title"], "Health");
    const notes = pickStr(h, ["notes", "description"], "");
    activities.push({
      icon: HeartPulse,
      text: notes ? `${status}: ${notes}` : status,
      time: ms ? formatDistanceToNow(ms, { addSuffix: true }) : "",
      color: "text-info",
      ms,
    });
  }

  for (const a of asRecordArray(attendanceRaw).slice(0, 5)) {
    const ms = parseTimeMs(a);
    const subj = pickStr(a, ["subject", "subject_name", "course", "name"], "Class");
    const pctN = pickNum(a, ["percentage", "pct", "attendance_percentage"]);
    const pct = pctN !== undefined ? String(Math.round(pctN)) : "";
    activities.push({
      icon: CheckCircle2,
      text: pct ? `Attendance: ${subj} (${pct}%)` : `Attendance: ${subj}`,
      time: ms ? formatDistanceToNow(ms, { addSuffix: true }) : "",
      color: "text-success",
      ms,
    });
  }

  activities.sort((x, y) => y.ms - x.ms);
  const recentActivity = activities.slice(0, 6);

  const subjects = att.subjects.filter((s) => s.name && (s.percentage > 0 || s.total));

  const loading = loadAtt && loadHealth && loadAnn;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName}</h1>
        <p className="mt-1 text-primary-foreground/80 text-sm md:text-base">
          Here&apos;s your daily overview at VIT Bhopal
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing your data…
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{stat.subtitle}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject-wise attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subject breakdown from the server yet.</p>
            ) : (
              subjects.map((subject) => (
                <div key={subject.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{subject.name}</span>
                    <span
                      className={`font-semibold ${
                        subject.percentage >= 75 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {subject.percentage}%
                    </span>
                  </div>
                  <Progress
                    value={subject.percentage}
                    className={`h-2 ${
                      subject.percentage < 75 ? "[&>div]:bg-destructive" : "[&>div]:bg-success"
                    }`}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Updates from your attendance and health logs will show up here.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{activity.text}</p>
                      {activity.time ? (
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
