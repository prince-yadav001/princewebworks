import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notifications } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

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
        <Button>Mark all as read</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border",
                notification.read ? "bg-background" : "bg-primary/5"
              )}
            >
              <div className={cn("mt-1 h-2 w-2 rounded-full", notification.read ? "bg-muted-foreground" : "bg-primary")} />
              <div className="grid gap-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
