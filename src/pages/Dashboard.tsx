import {
  CalendarCheck,
  HeartPulse,
  Building2,
  Megaphone,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Attendance",
    value: "87%",
    subtitle: "This semester",
    icon: CalendarCheck,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Health Status",
    value: "Good",
    subtitle: "Last checkup: 2 days ago",
    icon: HeartPulse,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Room Number",
    value: "B-204",
    subtitle: "Boys Hostel Block B",
    icon: Building2,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Notices",
    value: "3 New",
    subtitle: "Unread announcements",
    icon: Megaphone,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const recentActivity = [
  { icon: CheckCircle2, text: "Attendance marked for CSE301", time: "2 hours ago", color: "text-success" },
  { icon: Clock, text: "Health checkup reminder tomorrow", time: "5 hours ago", color: "text-warning" },
  { icon: AlertTriangle, text: "Low attendance warning: MAT201", time: "1 day ago", color: "text-destructive" },
  { icon: TrendingUp, text: "Monthly health report available", time: "2 days ago", color: "text-info" },
];

const subjects = [
  { name: "CSE301 - Data Structures", attendance: 92 },
  { name: "MAT201 - Linear Algebra", attendance: 68 },
  { name: "CSE302 - DBMS", attendance: 85 },
  { name: "HUM101 - English", attendance: 95 },
  { name: "PHY201 - Physics Lab", attendance: 78 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Rahul! 👋</h1>
        <p className="mt-1 text-primary-foreground/80 text-sm md:text-base">
          Here's your daily overview at VIT Bhopal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
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
        {/* Subject Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{subject.name}</span>
                  <span
                    className={`font-semibold ${
                      subject.attendance >= 75 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {subject.attendance}%
                  </span>
                </div>
                <Progress
                  value={subject.attendance}
                  className={`h-2 ${subject.attendance < 75 ? "[&>div]:bg-destructive" : "[&>div]:bg-success"}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
