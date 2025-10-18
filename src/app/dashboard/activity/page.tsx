import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { activities, users } from "@/lib/placeholder-data";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="hidden md:table-cell">Timestamp</TableHead>
              <TableHead className="hidden md:table-cell">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => {
              const user = users.find((u) => u.id === activity.userId);
              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="font-medium">{user?.name || 'System'}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {user?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{activity.action}</div>
                  </TableCell>
                  <TableCell>
                    {activity.objectType} #{activity.objectId}
                    {activity.details && (
                        <span className="text-muted-foreground text-xs block">
                            ({activity.details})
                        </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{activity.timestamp}</TableCell>
                  <TableCell className="hidden md:table-cell">{activity.ipAddress}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
