import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Search, Stethoscope, Shield, User } from "lucide-react";
import { useState } from "react";

type PersonType = "doctor" | "warden" | "staff";

interface Person {
  name: string;
  role: string;
  type: PersonType;
  phone: string;
  email: string;
  location: string;
  available: boolean;
  specialization?: string;
}

const people: Person[] = [
  { name: "Dr. Priya Sharma", role: "General Physician", type: "doctor", phone: "+91 98765 43210", email: "priya.sharma@vitbhopal.ac.in", location: "Health Center, Room 101", available: true, specialization: "General Medicine" },
  { name: "Dr. Rajesh Kumar", role: "Psychiatrist", type: "doctor", phone: "+91 98765 43211", email: "rajesh.kumar@vitbhopal.ac.in", location: "Health Center, Room 103", available: true, specialization: "Mental Health" },
  { name: "Dr. Anita Patel", role: "Dentist", type: "doctor", phone: "+91 98765 43212", email: "anita.patel@vitbhopal.ac.in", location: "Health Center, Room 105", available: false, specialization: "Dental Care" },
  { name: "Mr. Vikram Singh", role: "Boys Hostel Warden", type: "warden", phone: "+91 98765 43213", email: "vikram.singh@vitbhopal.ac.in", location: "Boys Hostel Block A, Ground Floor", available: true },
  { name: "Mrs. Sunita Devi", role: "Girls Hostel Warden", type: "warden", phone: "+91 98765 43214", email: "sunita.devi@vitbhopal.ac.in", location: "Girls Hostel Block A, Ground Floor", available: true },
  { name: "Mr. Amit Joshi", role: "Boys Hostel Asst. Warden", type: "warden", phone: "+91 98765 43215", email: "amit.joshi@vitbhopal.ac.in", location: "Boys Hostel Block B", available: true },
  { name: "Mr. Ravi Gupta", role: "Security Head", type: "staff", phone: "+91 98765 43216", email: "ravi.gupta@vitbhopal.ac.in", location: "Main Gate, Security Office", available: true },
  { name: "Mrs. Meena Iyer", role: "Mess Coordinator", type: "staff", phone: "+91 98765 43217", email: "meena.iyer@vitbhopal.ac.in", location: "Central Mess Building", available: true },
];

const typeConfig: Record<PersonType, { icon: typeof Stethoscope; color: string; bg: string }> = {
  doctor: { icon: Stethoscope, color: "text-info", bg: "bg-info/10" },
  warden: { icon: Shield, color: "text-primary", bg: "bg-primary/10" },
  staff: { icon: User, color: "text-accent", bg: "bg-accent/10" },
};

export default function Directory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PersonType | "all">("all");

  const filtered = people.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Directory</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Contact doctors, wardens, and staff
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "doctor", "warden", "staff"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f === "all" ? "All" : f + "s"}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((person) => {
          const config = typeConfig[person.type];
          return (
            <Card key={person.email} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${config.bg} flex-shrink-0`}>
                    <config.icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{person.name}</h3>
                      <Badge
                        variant={person.available ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {person.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                    {person.specialization && (
                      <p className="text-xs text-info mt-0.5">{person.specialization}</p>
                    )}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{person.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{person.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{person.location}</span>
                      </div>
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
