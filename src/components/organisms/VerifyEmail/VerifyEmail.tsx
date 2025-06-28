"use client"

import { useState } from "react";
import api from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/lib/constant/Route";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter()

 const handleVerify = async () => {
  setLoading(true);
  try {
    const res = await api.post("/auth/verify-email", { email, code: code.trim() });
    setStatus(res.data.msg);
    router.push(LOGIN)
    toast.success("verification done")
  } catch  {
   toast.error("verifiaction failed")
  } finally {
    setLoading(false);
  }
};


  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await api.post("/auth/resend-code", { email });
      setStatus(res.data.msg);
      router.push(LOGIN)
    } catch (err : any) {
      setStatus(err.response?.data?.msg || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Verify your email</h2>
          <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="text" placeholder="Enter verification code" value={code} onChange={e => setCode(e.target.value)} />
          <div className="flex flex-row gap-3">
               <Button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <Button variant="outline" onClick={handleResend} disabled={resendLoading || !email}>
            {resendLoading ? "Resending..." : "Resend Code"}
          </Button>
          </div>
          {status && <p className="text-center mt-2">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
