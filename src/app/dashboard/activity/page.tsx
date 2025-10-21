import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ActivityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          A log of all actions taken in the workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
            <p className="text-muted-foreground">No activity to display.</p>
            <p className="text-sm text-muted-foreground">Live data coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
