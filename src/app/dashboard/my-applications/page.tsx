"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

// Define the types for better type-safety
interface Job {
  id: string;
  title: string;
  department: string | null;
}

interface JobApplication {
  id: string;
  jobId: string;
  appliedAt: string;
  status: string;
  job: Job;
}

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/my-applications?userId=${user.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await res.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">{status}</Badge>;
      case "selected":
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">{status}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{status}</Badge>;
      case "pending":
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


  if (loading) {
    return <p>Loading your applications...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Job Applications</CardTitle>
        <CardDescription>
          Track the status of all your job applications here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.job.title}</TableCell>
                  <TableCell>{app.job.department || 'N/A'}</TableCell>
                  <TableCell>
                    {format(new Date(app.appliedAt), "PPP")}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(app.status)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You have not applied for any jobs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
