import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar, AlertTriangle, Info, Star } from "lucide-react";

type Priority = "urgent" | "important" | "general";

interface Announcement {
  title: string;
  content: string;
  date: string;
  priority: Priority;
  category: string;
  author: string;
}

const announcements: Announcement[] = [
  {
    title: "Hostel Room Inspection - Saturday",
    content: "Mandatory room inspection scheduled for this Saturday at 10:00 AM. Please ensure your rooms are clean and all electrical appliances are stored properly.",
    date: "April 5, 2026",
    priority: "important",
    category: "Hostel",
    author: "Warden Office",
  },
  {
    title: "Water Supply Interruption - Block B",
    content: "Due to maintenance work, water supply to Boys Hostel Block B will be interrupted from 10 AM to 2 PM on April 7. Please store water in advance.",
    date: "April 4, 2026",
    priority: "urgent",
    category: "Maintenance",
    author: "Facilities Dept",
  },
  {
    title: "Health Camp - Free Eye Checkup",
    content: "A free eye checkup camp is being organized at the Health Center on April 10, 2026. All students are encouraged to participate. Registration at the Health Center.",
    date: "April 3, 2026",
    priority: "general",
    category: "Health",
    author: "Health Center",
  },
  {
    title: "Annual Sports Meet Registration Open",
    content: "Registrations for the Annual Sports Meet 2026 are now open. Last date to register is April 15. Contact your hostel sports coordinator for details.",
    date: "April 2, 2026",
    priority: "general",
    category: "Sports",
    author: "Sports Committee",
  },
  {
    title: "New Mess Menu Effective April 7",
    content: "The revised mess menu will be effective from April 7. The menu has been updated based on student feedback. Please check the notice board for details.",
    date: "April 1, 2026",
    priority: "important",
    category: "Mess",
    author: "Mess Committee",
  },
];

const priorityConfig: Record<Priority, { icon: typeof AlertTriangle; color: string; bg: string; badge: string }> = {
  urgent: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", badge: "destructive" },
  important: { icon: Star, color: "text-warning", bg: "bg-warning/10", badge: "default" },
  general: { icon: Info, color: "text-info", bg: "bg-info/10", badge: "secondary" },
};

export default function Announcements() {
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

      <div className="space-y-4">
        {announcements.map((a, i) => {
          const config = priorityConfig[a.priority];
          return (
            <Card key={i} className="hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${config.bg} flex-shrink-0 mt-0.5`}>
                    <config.icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{a.title}</h3>
                      <Badge variant={config.badge as any} className="text-xs capitalize flex-shrink-0">
                        {a.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{a.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{a.date}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{a.category}</Badge>
                      <span>By {a.author}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
