import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const weekData = [
  { day: "Mon", classes: 5, attended: 5 },
  { day: "Tue", classes: 4, attended: 3 },
  { day: "Wed", classes: 5, attended: 5 },
  { day: "Thu", classes: 4, attended: 4 },
  { day: "Fri", classes: 3, attended: 2 },
  { day: "Sat", classes: 2, attended: 2 },
];

const monthlyData = [
  { month: "Jan", percentage: 92 },
  { month: "Feb", percentage: 88 },
  { month: "Mar", percentage: 85 },
  { month: "Apr", percentage: 87 },
];

const subjects = [
  { name: "CSE301 - Data Structures", total: 40, attended: 37, percentage: 92, trend: "up" },
  { name: "MAT201 - Linear Algebra", total: 38, attended: 26, percentage: 68, trend: "down" },
  { name: "CSE302 - DBMS", total: 36, attended: 31, percentage: 85, trend: "up" },
  { name: "HUM101 - English", total: 30, attended: 28, percentage: 95, trend: "up" },
  { name: "PHY201 - Physics Lab", total: 20, attended: 16, percentage: 78, trend: "down" },
  { name: "CSE303 - OS", total: 35, attended: 30, percentage: 86, trend: "up" },
];

export default function Attendance() {
  const overallAttendance = 87;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Attendance Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your class attendance across all subjects</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-3">
              <span className="text-2xl font-bold text-success">{overallAttendance}%</span>
            </div>
            <p className="text-sm font-medium">Overall Attendance</p>
            <p className="text-xs text-muted-foreground">Semester average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-info/10 mb-3">
              <span className="text-2xl font-bold text-info">168</span>
            </div>
            <p className="text-sm font-medium">Classes Attended</p>
            <p className="text-xs text-muted-foreground">Out of 199 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-warning/10 mb-3">
              <span className="text-2xl font-bold text-warning">2</span>
            </div>
            <p className="text-sm font-medium">Subjects Below 75%</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {weekData.map((day) => {
              const pct = Math.round((day.attended / day.classes) * 100);
              return (
                <div key={day.day} className="text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
                  <div
                    className={`rounded-xl py-3 px-2 ${
                      pct === 100
                        ? "bg-success/10 border border-success/20"
                        : pct >= 75
                        ? "bg-info/10 border border-info/20"
                        : "bg-destructive/10 border border-destructive/20"
                    }`}
                  >
                    <p className="text-lg font-bold">{day.attended}/{day.classes}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => (
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
                      {subject.trend === "up" ? (
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
                    {subject.attended} / {subject.total} classes attended
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold">{m.percentage}%</span>
                <div
                  className="w-full rounded-t-lg gradient-primary transition-all duration-500"
                  style={{ height: `${m.percentage}%` }}
                />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
