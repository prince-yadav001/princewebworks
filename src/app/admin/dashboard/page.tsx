
import {
  Users,
  UserCheck,
  FileText,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LeadsOverviewChart from "@/components/charts/leads-overview-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { Role } from "@prisma/client";

async function getAnalyticsData() {
    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({
        where: { isVerified: true }
    });
    const totalApplications = await prisma.jobApplication.count();
    
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const activeUsersToday = await prisma.user.count({
        where: {
            lastLogin: {
                gte: startOfToday,
            }
        }
    });

    const lastMonth = subDays(today, 30);
    const usersLastMonth = await prisma.user.count({
        where: { createdAt: { gte: lastMonth } }
    });


    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        totalUsers,
        verifiedUsers,
        totalApplications,
        activeUsersToday,
        usersLastMonth,
        recentUsers,
    }
}


export default async function AdminDashboardPage() {

  const { totalUsers, verifiedUsers, totalApplications, activeUsersToday, recentUsers, usersLastMonth } = await getAnalyticsData();
  const verifiedPercentage = totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(0) : 0;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{usersLastMonth} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">{verifiedPercentage}% of total users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Across all job postings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeUsersToday}</div>
            <p className="text-xs text-muted-foreground">Users online today</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users in the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <LeadsOverviewChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Distribution of user roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[350px] bg-secondary rounded-md">
                <p className="text-muted-foreground">Pie Chart Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

       {/* Recent Users Table */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                    A list of the most recently registered users.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentUsers.map((user) => (
                    <TableRow key={user.email}>
                        <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.role === Role.ADMIN ? 'destructive' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.isVerified ? 'default' : 'outline'}>
                                {user.isVerified ? "Verified" : "Pending"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem>View User</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

    </div>
  );
}
