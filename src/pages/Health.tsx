import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Thermometer,
  Droplets,
  Moon,
  Activity,
  Plus,
  FileText,
} from "lucide-react";

const healthMetrics = [
  { title: "Last Checkup", value: "March 28", icon: HeartPulse, color: "text-info", bg: "bg-info/10" },
  { title: "Temperature", value: "98.4°F", icon: Thermometer, color: "text-success", bg: "bg-success/10" },
  { title: "Blood Pressure", value: "120/80", icon: Droplets, color: "text-primary", bg: "bg-primary/10" },
  { title: "Sleep Average", value: "6.5 hrs", icon: Moon, color: "text-accent", bg: "bg-accent/10" },
];

const healthLog = [
  { date: "April 3, 2026", status: "Healthy", notes: "Routine checkup - all clear", type: "checkup" },
  { date: "March 28, 2026", status: "Minor Cold", notes: "Prescribed paracetamol, rest advised", type: "sick" },
  { date: "March 15, 2026", status: "Healthy", notes: "Monthly health screening", type: "checkup" },
  { date: "March 5, 2026", status: "Headache", notes: "Referred to Dr. Sharma, stress-related", type: "sick" },
  { date: "February 20, 2026", status: "Healthy", notes: "Blood test results normal", type: "checkup" },
];

const weeklyWellness = [
  { day: "Mon", sleep: 7, water: 8, exercise: true },
  { day: "Tue", sleep: 6, water: 6, exercise: false },
  { day: "Wed", sleep: 7.5, water: 7, exercise: true },
  { day: "Thu", sleep: 5, water: 5, exercise: false },
  { day: "Fri", sleep: 6.5, water: 8, exercise: true },
  { day: "Sat", sleep: 8, water: 7, exercise: true },
  { day: "Sun", sleep: 9, water: 6, exercise: false },
];

export default function Health() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Health Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your health and wellness</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Symptoms
        </Button>
      </div>

      {/* Health Metrics */}
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
                  <p className="text-lg font-bold">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Wellness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-info" />
              Weekly Wellness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyWellness.map((day) => (
                <div key={day.day} className="flex items-center gap-3 text-sm">
                  <span className="w-8 font-medium text-muted-foreground">{day.day}</span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className={day.sleep >= 7 ? "text-success font-medium" : "text-warning font-medium"}>
                        {day.sleep}h
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className={day.water >= 7 ? "text-success font-medium" : "text-warning font-medium"}>
                        {day.water} glasses
                      </span>
                    </div>
                    <Badge variant={day.exercise ? "default" : "secondary"} className="text-xs">
                      {day.exercise ? "✓ Exercise" : "No exercise"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Health Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthLog.map((entry, i) => (
                <div key={i} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div
                    className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      entry.type === "checkup" ? "bg-success" : "bg-warning"
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{entry.status}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.notes}</p>
                    <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
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
