import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [emailNotices, setEmailNotices] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-muted">
          <SettingsIcon className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm">Preferences for this device</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>
            These options are stored locally only until connected to your backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-notices">Email notices</Label>
              <p className="text-xs text-muted-foreground">Receive updates by email (placeholder)</p>
            </div>
            <Switch id="email-notices" checked={emailNotices} onCheckedChange={setEmailNotices} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
