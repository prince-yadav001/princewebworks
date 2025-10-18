import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Make changes to your personal account here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="Alice" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Johnson" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alice@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="workspace">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Manage your current workspace settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input id="workspace-name" defaultValue="SaaS Innovations" />
              </div>
              <div className="space-y-2">
                <Label>Workspace Members</Label>
                <p className="text-sm text-muted-foreground">Manage members in workspace settings.</p>
                <Button variant="outline">Manage Members</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Workspace</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Email Notifications</Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email-tasks" defaultChecked />
                        <Label htmlFor="email-tasks" className="font-normal">New task assignments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email-leads" />
                        <Label htmlFor="email-leads" className="font-normal">New lead assignments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email-summary" defaultChecked />
                        <Label htmlFor="email-summary" className="font-normal">Daily activity summary</Label>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Push Notifications</Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="push-calls" defaultChecked />
                        <Label htmlFor="push-calls" className="font-normal">Incoming calls</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="push-mentions" defaultChecked />
                        <Label htmlFor="push-mentions" className="font-normal">Mentions in comments</Label>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
