"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, MapPin } from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string | null;
  description: string;
  location: string | null;
  type: string | null;
}

export default function JobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load job opportunities.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [toast]);

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to apply.",
      });
      return;
    }
    setApplying(jobId);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to apply");
      }

      toast({
        title: "Application Successful",
        description: "Your application has been submitted.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: err.message,
      });
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return <p>Loading job opportunities...</p>;
  }

  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle>Job Opportunities</CardTitle>
          <CardDescription>
            Find your next role within our company.
          </CardDescription>
        </CardHeader>
      </Card>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                {job.department && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {job.department}
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>
              {job.type && <Badge variant="secondary" className="mt-4">{job.type}</Badge>}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleApply(job.id)}
                disabled={applying === job.id}
              >
                {applying === job.id ? "Applying..." : "Apply Now"}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No job openings at the moment. Please check back later.</p>
      )}
    </div>
  );
}
