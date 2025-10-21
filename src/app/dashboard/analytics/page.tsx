
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { Users, UserCheck, FileText, Activity } from "lucide-react";


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

    return {
        totalUsers,
        verifiedUsers,
        totalApplications,
        activeUsersToday,
    }
}


export default async function AnalyticsPage() {

  const { totalUsers, verifiedUsers, totalApplications, activeUsersToday } = await getAnalyticsData();
  const verifiedPercentage = totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(0) : 0;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
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
             Across all jobs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
             <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsersToday}</div>
            <p className="text-xs text-muted-foreground">Users online today</p>
          </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>More Analytics</CardTitle>
                <CardDescription>
                    Live analytics and charts are coming soon.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-center py-10">
                    <p className="text-muted-foreground">More charts and tables will be displayed here.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
