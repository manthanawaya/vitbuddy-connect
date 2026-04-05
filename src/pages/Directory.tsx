import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Search, User, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getStudents, asRecordArray, pickStr } from "@/lib/xano";

export default function Directory() {
  const [search, setSearch] = useState("");
  const { data: raw, isLoading, isError, error } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const students = useMemo(() => asRecordArray(raw), [raw]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;
    return students.filter((s) => {
      const name = pickStr(s, ["name", "full_name", "student_name"], "").toLowerCase();
      const email = pickStr(s, ["email"], "").toLowerCase();
      const reg = pickStr(s, ["reg_no", "registration", "register_number"], "").toLowerCase();
      const prog = pickStr(s, ["program", "branch", "course"], "").toLowerCase();
      return (
        name.includes(q) || email.includes(q) || reg.includes(q) || prog.includes(q)
      );
    });
  }, [students, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Student directory</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Students from the portal ({students.length} total)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, registration…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading students…
        </div>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message || "Could not load students."}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s, idx) => {
          const name = pickStr(s, ["name", "full_name", "student_name"], "Student");
          const email = pickStr(s, ["email"], "");
          const phone = pickStr(s, ["phone", "mobile", "contact"], "");
          const room = pickStr(s, ["room", "room_number", "hostel_room"], "");
          const block = pickStr(s, ["hostel", "hostel_block", "block"], "");
          const prog = pickStr(s, ["program", "branch", "course"], "");
          const key = email || pickStr(s, ["id"], String(idx));
          return (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{name}</h3>
                      {prog ? (
                        <Badge variant="secondary" className="text-xs">
                          {prog}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {phone ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{phone}</span>
                        </div>
                      ) : null}
                      {email ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{email}</span>
                        </div>
                      ) : null}
                      {(room || block) ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>
                            {[room, block].filter(Boolean).join(" · ")}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No students match your search.
        </p>
      )}
    </div>
  );
}
