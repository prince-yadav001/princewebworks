import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Here is a list of your recent notifications.
          </CardDescription>
        </div>
        <Button disabled>Mark all as read</Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
            <p className="text-muted-foreground">No notifications to display.</p>
            <p className="text-sm text-muted-foreground">Live data coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
