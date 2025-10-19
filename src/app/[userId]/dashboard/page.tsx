
"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format, formatDistanceToNow } from "date-fns";
import { Mail, Calendar, CheckCircle, User, LogOut } from "lucide-react";

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'avatar1');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">User Dashboard</CardTitle>
            <CardDescription>
              Welcome back, {user.name}! Here's a summary of your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Avatar" />}
                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold">{user.name}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button asChild>
                    <Link href="/dashboard/my-applications">My Job Applications</Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/dashboard/settings">Edit Profile</Link>
                </Button>
                <Button variant="destructive" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
