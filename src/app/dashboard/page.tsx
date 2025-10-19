
"use client";
import Link from "next/link";
import { ArrowUpRight, PlusCircle, User, Calendar, Mail, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { activities, leads, tasks, users } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import LeadsOverviewChart from "@/components/charts/leads-overview-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";


export default function DashboardPage() {
  const { user } = useAuth();

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const newLeadsThisMonth = leads.filter((l) => l.status === "New").length;
  const unreadNotifications = 4;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar1');

  return (
    <div className="flex flex-col w-full gap-8">
      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 col-span-1">
            <Avatar className="h-20 w-20">
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Avatar" />}
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 col-span-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${user.isVerified ? 'text-green-500' : 'text-red-500'}`} />
              <span>{user.isVerified ? "Verified" : "Not Verified"}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {format(new Date(user.createdAt), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Last login: {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pipeline Value
            </CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newLeadsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}/{totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              Check your inbox
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Leads Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                Your top 5 newest leads in the pipeline.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/leads">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 5).map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {lead.contact}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <Button className="w-full mt-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
            </Button>
          </CardContent>
        </Card>

        {/* Tasks Snapshot */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Tasks Snapshot</CardTitle>
               <CardDescription>
                A quick look at your most urgent tasks.
              </CardDescription>
            </div>
             <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/tasks">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Due Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.filter(t => t.status !== 'Completed').slice(0, 5).map((task) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button className="w-full mt-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                A log of recent activities in your workspace.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/activity">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            {activities.slice(0, 5).map((activity) => {
              const activityUser = users.find((u) => u.id === activity.userId);
              const userAvatar = PlaceHolderImages.find(
                (p) => p.id === activityUser?.avatar
              );
              return (
                <div className="flex items-center gap-4" key={activity.id}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    {userAvatar && (
                      <AvatarImage src={userAvatar.imageUrl} alt="Avatar" />
                    )}
                    <AvatarFallback>{activityUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {activityUser?.name}{" "}
                      <span className="font-normal text-muted-foreground">
                        {activity.action.toLowerCase()}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.objectType} #{activity.objectId}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">
                    {activity.timestamp}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

       {/* Charts & Insights */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Leads Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LeadsOverviewChart />
          </CardContent>
        </Card>

        {/* This can be a second chart */}
        <Card>
            <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>Monthly task completion trend.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Placeholder for another chart */}
                <div className="flex items-center justify-center h-[350px] bg-secondary rounded-md">
                    <p className="text-muted-foreground">Task Completion Chart Coming Soon</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
