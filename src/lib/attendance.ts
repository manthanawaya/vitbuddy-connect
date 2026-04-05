import { asRecordArray, pickNum, pickStr } from "@/lib/xano";

export type SubjectAttendanceRow = {
  name: string;
  percentage: number;
  attended?: number;
  total?: number;
};

export function parseAttendanceData(raw: unknown): {
  overallPct: number | null;
  totalAttended: number;
  totalClasses: number;
  subjects: SubjectAttendanceRow[];
  below75: number;
} {
  const records = asRecordArray(raw);
  let sumPct = 0;
  let pctCount = 0;
  let totalAttended = 0;
  let totalClasses = 0;
  const subjects: SubjectAttendanceRow[] = [];

  for (const r of records) {
    const name = pickStr(
      r,
      ["subject", "subject_name", "course", "course_name", "name", "title", "class"],
      "Entry"
    );
    const pct = pickNum(r, [
      "percentage",
      "pct",
      "attendance_percentage",
      "percent",
      "attendance_pct",
    ]);
    const attended = pickNum(r, [
      "attended",
      "present",
      "attended_classes",
      "classes_attended",
    ]);
    const total = pickNum(r, ["total", "total_classes", "classes", "classes_total"]);

    let percentage = pct;
    if (percentage === undefined && attended !== undefined && total !== undefined && total > 0) {
      percentage = Math.round((attended / total) * 100);
    }

    if (percentage !== undefined) {
      sumPct += percentage;
      pctCount += 1;
    }
    if (attended !== undefined) totalAttended += attended;
    if (total !== undefined) totalClasses += total;

    subjects.push({
      name,
      percentage: percentage ?? 0,
      attended,
      total,
    });
  }

  let overallPct: number | null = pctCount > 0 ? Math.round(sumPct / pctCount) : null;
  if (overallPct === null && totalClasses > 0 && totalAttended >= 0) {
    overallPct = Math.round((totalAttended / totalClasses) * 100);
  }

  const below75 = subjects.filter((s) => s.percentage < 75).length;

  return { overallPct, totalAttended, totalClasses, subjects, below75 };
}
