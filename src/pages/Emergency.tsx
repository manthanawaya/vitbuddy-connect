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

/** Standard emergency numbers (India). Add campus-specific numbers from official sources. */
const emergencyContacts = [
  { name: "National emergency", number: "112", icon: Siren, color: "text-destructive", bg: "bg-destructive/10" },
  { name: "Ambulance", number: "108", icon: HeartPulse, color: "text-destructive", bg: "bg-destructive/10" },
  { name: "Fire", number: "101", icon: Flame, color: "text-warning", bg: "bg-warning/10" },
  { name: "Police", number: "100", icon: Shield, color: "text-primary", bg: "bg-primary/10" },
  {
    name: "Campus security / health desk",
    number: "",
    icon: Stethoscope,
    color: "text-info",
    bg: "bg-info/10",
    hint: "Use the number published on your ID card, hostel notice board, or institute website.",
  },
];

const tips = [
  "In case of fire, use stairs and avoid elevators where smoke is present.",
  "For life-threatening emergencies, call the national emergency number or ambulance first.",
  "Keep your institute ID and any medical information easily accessible.",
  "Know where fire extinguishers and assembly points are on your floor.",
  "For medical emergencies, follow staff instructions and do not move an injured person unless necessary.",
  "Report suspicious activity to campus security using the official channel.",
];

export default function Emergency() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground">
        <div className="flex items-center gap-3 mb-2">
          <Siren className="h-7 w-7" />
          <h1 className="text-2xl md:text-3xl font-bold">Emergency contacts</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Quick access to common emergency numbers. Save official campus contacts from institute notices.
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
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{contact.name}</p>
                  {contact.number ? (
                    <p className="text-lg font-bold text-primary">{contact.number}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">{contact.hint}</p>
                  )}
                </div>
              </div>
              {contact.number ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 gap-2"
                  type="button"
                  onClick={() => window.open(`tel:${contact.number.replace(/\D/g, "")}`)}
                >
                  <Phone className="h-4 w-4" />
                  Call now
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Emergency tips
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
