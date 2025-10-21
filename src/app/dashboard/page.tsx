"use client";
import { Mail, Calendar, CheckCircle, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";

// Helper function to generate a seed from email
const getSeedFromEmail = (email: string) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};


export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  const avatarSeed = getSeedFromEmail(user.email || '');
  const avatarUrl = `https://picsum.photos/seed/${avatarSeed}/100/100`;


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
              {user.email && <AvatarImage src={avatarUrl} alt="Avatar" data-ai-hint="person portrait"/>}
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
    </div>
  );
}
