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

/** Static campus reference — not loaded from the API (no hostel endpoint). */
const hostelBlocks = [
  {
    name: "Boys hostel — Block A",
    type: "boys" as const,
    note: "Room allotment and warden contact: hostel office.",
  },
  {
    name: "Boys hostel — Block B",
    type: "boys" as const,
    note: "Room allotment and warden contact: hostel office.",
  },
  {
    name: "Girls hostel — Block A",
    type: "girls" as const,
    note: "Room allotment and warden contact: hostel office.",
  },
  {
    name: "Girls hostel — Block B",
    type: "girls" as const,
    note: "Room allotment and warden contact: hostel office.",
  },
];

const facilities = [
  { name: "Wi‑Fi", icon: Wifi, status: "Campus / hostel network (see IT policy)" },
  { name: "Mess", icon: Utensils, status: "Meals per institute schedule" },
  { name: "Security", icon: ShieldCheck, status: "24/7 campus security" },
  { name: "Curfew", icon: Clock, status: "As per current hostel handbook" },
  { name: "Water", icon: Droplets, status: "RO / supply per block" },
  { name: "Power backup", icon: Zap, status: "As per campus infrastructure" },
];

const messSchedule = [
  { meal: "Breakfast", time: "See mess notice board" },
  { meal: "Lunch", time: "See mess notice board" },
  { meal: "Snacks", time: "See mess notice board" },
  { meal: "Dinner", time: "See mess notice board" },
];

const rules = [
  "Carry your institute ID inside hostel premises.",
  "Follow visitor hours and areas defined in the hostel handbook.",
  "Observe night curfew and late-entry procedures issued by the warden office.",
  "Ragging is prohibited; report concerns to the anti-ragging cell.",
  "Use only permitted electrical appliances; follow fire-safety notices.",
  "Alcohol, tobacco, and illegal substances are not allowed.",
  "Participate in scheduled room inspections when announced.",
  "Report maintenance issues to the hostel office within a reasonable time.",
];

export default function Hostel() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Hostel information</h1>
        <p className="text-muted-foreground text-sm mt-1">
          General reference — confirm timings and rules with the hostel office and official notices.
        </p>
      </div>

      <Tabs defaultValue="blocks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blocks">Hostel blocks</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="mess">Mess schedule</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostelBlocks.map((block) => (
              <Card key={block.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${block.type === "boys" ? "bg-info/10" : "bg-accent/10"} flex-shrink-0`}
                    >
                      <Building2
                        className={`h-6 w-6 ${block.type === "boys" ? "text-info" : "text-accent"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{block.name}</h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" />
                          <span>Occupancy and room details: hostel office</span>
                        </div>
                        <p>{block.note}</p>
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
                Mess schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messSchedule.map((item) => (
                  <div
                    key={item.meal}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
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
                Hostel rules & regulations
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
