import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Siren,
  Flame,
  Stethoscope,
  Shield,
  HeartPulse,
  AlertTriangle,
} from "lucide-react";

const emergencyContacts = [
  { name: "Campus Emergency", number: "1800-XXX-XXXX", icon: Siren, color: "text-destructive", bg: "bg-destructive/10" },
  { name: "Health Center", number: "+91 98765 43210", icon: Stethoscope, color: "text-info", bg: "bg-info/10" },
  { name: "Fire Station", number: "101", icon: Flame, color: "text-warning", bg: "bg-warning/10" },
  { name: "Campus Security", number: "+91 98765 43216", icon: Shield, color: "text-primary", bg: "bg-primary/10" },
  { name: "Ambulance", number: "108", icon: HeartPulse, color: "text-destructive", bg: "bg-destructive/10" },
  { name: "Police", number: "100", icon: AlertTriangle, color: "text-primary", bg: "bg-primary/10" },
];

const tips = [
  "In case of fire, use stairs and never use elevators.",
  "Call campus emergency first, then dial 112 for national emergency.",
  "Keep your medical insurance card and ID always accessible.",
  "Know the location of the nearest fire extinguisher on your floor.",
  "In case of medical emergency, do not move the person unless necessary.",
  "Report any suspicious activity to campus security immediately.",
];

export default function Emergency() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground">
        <div className="flex items-center gap-3 mb-2">
          <Siren className="h-7 w-7" />
          <h1 className="text-2xl md:text-3xl font-bold">Emergency Contacts</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Quick access to all emergency numbers. Save these contacts on your phone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyContacts.map((contact) => (
          <Card key={contact.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${contact.bg}`}>
                  <contact.icon className={`h-6 w-6 ${contact.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{contact.name}</p>
                  <p className="text-lg font-bold text-primary">{contact.number}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 gap-2"
                onClick={() => window.open(`tel:${contact.number}`)}
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Emergency Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-warning/10 flex items-center justify-center text-xs font-bold text-warning">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
