"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, ListTodo, Phone, Activity, Bell } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/logo";

const featureCards = [
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Workspace Management",
    description: "Organize leads, tasks, and calls across multiple workspaces.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Lead Management",
    description: "Import and track leads through your entire sales pipeline.",
  },
  {
    icon: <ListTodo className="w-8 h-8 text-primary" />,
    title: "Task Management",
    description: "Create, assign, and monitor tasks to stay on top of your work.",
  },
  {
    icon: <Phone className="w-8 h-8 text-primary" />,
    title: "Call Tracking",
    description: "Log call details, including duration, type, and recordings.",
  },
  {
    icon: <Activity className="w-8 h-8 text-primary" />,
    title: "Activity Logs",
    description: "Keep a detailed record of all user actions for accountability.",
  },
  {
    icon: <Bell className="w-8 h-8 text-primary" />,
    title: "Notifications",
    description: "Get instant alerts for new tasks, calls, and important updates.",
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') {
        router.push("/dashboard");
      } else {
        router.push(`/${user.id}/dashboard`);
      }
    }
  }, [user, loading, router]);


  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 font-headline">
                Streamline Your Workflow with PrinceWebWork CRM
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                The all-in-one platform to manage your leads, tasks, and customer interactions effortlessly. Built for growing businesses.
              </p>
              <Button size="lg" asChild>
                <Link href="/register">Get Started for Free</Link>
              </Button>
            </div>
            <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              {heroImage && <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Powerful Features, Simple Interface</h2>
              <p className="text-lg text-muted-foreground mb-12">
                Everything you need to grow your business, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((feature) => (
                <Card key={feature.title} className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} PrinceWebWork. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
