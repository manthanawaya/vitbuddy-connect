import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Wifi,
  Utensils,
  ShieldCheck,
  Clock,
  Droplets,
  Zap,
} from "lucide-react";

const hostelBlocks = [
  {
    name: "Boys Hostel - Block A",
    type: "boys",
    rooms: 120,
    occupied: 112,
    warden: "Mr. Vikram Singh",
    contact: "+91 98765 43213",
  },
  {
    name: "Boys Hostel - Block B",
    type: "boys",
    rooms: 100,
    occupied: 95,
    warden: "Mr. Amit Joshi",
    contact: "+91 98765 43215",
  },
  {
    name: "Girls Hostel - Block A",
    type: "girls",
    rooms: 110,
    occupied: 105,
    warden: "Mrs. Sunita Devi",
    contact: "+91 98765 43214",
  },
  {
    name: "Girls Hostel - Block B",
    type: "girls",
    rooms: 90,
    occupied: 82,
    warden: "Mrs. Kavita Rao",
    contact: "+91 98765 43218",
  },
];

const facilities = [
  { name: "Wi-Fi", icon: Wifi, status: "24/7 Available" },
  { name: "Mess", icon: Utensils, status: "3 Meals + Snacks" },
  { name: "Security", icon: ShieldCheck, status: "24/7 CCTV" },
  { name: "Curfew", icon: Clock, status: "10:00 PM" },
  { name: "Water", icon: Droplets, status: "RO Purified" },
  { name: "Power Backup", icon: Zap, status: "100% Backup" },
];

const messSchedule = [
  { meal: "Breakfast", time: "7:30 AM - 9:30 AM" },
  { meal: "Lunch", time: "12:30 PM - 2:30 PM" },
  { meal: "Snacks", time: "4:30 PM - 5:30 PM" },
  { meal: "Dinner", time: "7:30 PM - 9:30 PM" },
];

const rules = [
  "Students must carry ID cards at all times within hostel premises.",
  "Visitors allowed only in the visitor area between 4 PM - 7 PM.",
  "Night curfew is at 10:00 PM. Late entry requires warden approval.",
  "Ragging in any form is strictly prohibited and punishable.",
  "Electrical appliances (heaters, irons) are not allowed in rooms.",
  "Consumption of alcohol and tobacco is strictly prohibited.",
  "Room cleanliness inspection every Saturday at 10 AM.",
  "Any maintenance issue should be reported to the warden within 24 hours.",
];

export default function Hostel() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Hostel Information</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Everything about your hostel life at VIT Bhopal
        </p>
      </div>

      <Tabs defaultValue="blocks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blocks">Hostel Blocks</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="mess">Mess Schedule</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostelBlocks.map((block) => (
              <Card key={block.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${block.type === "boys" ? "bg-info/10" : "bg-accent/10"} flex-shrink-0`}>
                      <Building2 className={`h-6 w-6 ${block.type === "boys" ? "text-info" : "text-accent"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{block.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          <span>{block.occupied} / {block.rooms} rooms occupied</span>
                        </div>
                        <p>Warden: {block.warden}</p>
                        <p>Contact: {block.contact}</p>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${block.type === "boys" ? "bg-info" : "bg-accent"}`}
                            style={{ width: `${(block.occupied / block.rooms) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facilities">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((f) => (
              <Card key={f.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.status}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mess">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Utensils className="h-5 w-5 text-accent" />
                Daily Mess Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messSchedule.map((item) => (
                  <div key={item.meal} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-sm">{item.meal}</span>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Hostel Rules & Regulations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {rules.map((rule, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
