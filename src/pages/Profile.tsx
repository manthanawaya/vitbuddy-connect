import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { pickStr } from "@/lib/xano";
import { User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const u = user || {};

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: pickStr(u, ["name", "full_name", "display_name", "student_name"], "—") },
    { label: "Email", value: pickStr(u, ["email"], "—") },
    { label: "Phone", value: pickStr(u, ["phone", "mobile", "contact"], "—") },
    { label: "Registration", value: pickStr(u, ["reg_no", "registration", "register_number"], "—") },
    { label: "Program", value: pickStr(u, ["program", "branch", "course"], "—") },
    { label: "Room", value: pickStr(u, ["room", "room_number", "hostel_room"], "—") },
    { label: "Hostel", value: pickStr(u, ["hostel", "hostel_block", "block"], "—") },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My profile</h1>
          <p className="text-muted-foreground text-sm">Details from your account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4 text-sm border-b border-border/60 pb-2 last:border-0 last:pb-0">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-right break-all">{row.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
