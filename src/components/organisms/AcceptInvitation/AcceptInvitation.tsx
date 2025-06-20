"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/api/auth";
import { DASHBOARD } from "@/lib/constant/Route";
import { toast } from "sonner";

export default function AcceptInvite({ inviteToken }: { inviteToken: string }) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!inviteToken) {
        setStatus("error");
        setMessage("Invalid invitation link.");
        return;
      }

      const payload = {
        token: inviteToken
      }

      try {
        const token = localStorage.getItem("token");
        const res = await api.post("/accept", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStatus("success");
        toast.success("Invitation accepted! Redirecting to your dashboard...")

        setTimeout(() => {
          window.location.href = DASHBOARD;
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.msg || "Failed to accept invitation.");
        toast.error("Failed to accept invitation.")
      }
    };

    acceptInvitation();
  }, [inviteToken]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">Accepting Invitation...</h1>
      {status !== "idle" && (
        <p className={status === "success" ? "text-green-600" : "text-red-600"}>{message}</p>
      )}
      {status === "error" && (
        <Button onClick={() => (window.location.href = "/dashboard")}>
          Go to Dashboard
        </Button>
      )}
    </div>
  );
}
