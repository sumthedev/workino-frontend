"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, CheckCircle, Lock } from "lucide-react"
import { ResetPasswordFormValues, ResetPasswordSchema } from "@/lib/validation/auth"
import { useSearchParams } from "next/navigation"
import api from "@/api/auth"
import Link from "next/link"
import { LOGIN } from "@/lib/constant/Route"


export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const initialValues: ResetPasswordFormValues = {
    password: "",
    confirmPassword: "",
  }

 const handleSubmit = async (values: ResetPasswordFormValues, { setSubmitting, setStatus }: any) => {
    try {
      if (!email || !token) {
        setStatus({ type: "error", message: "Missing token or email." });
        return;
      }

      await api.post("/auth/reset-password", {
        email,
        token,
        newPassword: values.password
      });

      setIsReset(true);
      setStatus({ type: "success", message: "Password reset successfully!" });
    } catch (error: any) {
      setStatus({ type: "error", message: error.response?.data?.msg || "Failed to reset password. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (isReset) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700">Password Reset!</h2>
              <p className="text-gray-600">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Button className="w-full">Continue to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below. Make sure it is strong and secure.
          </CardDescription>
        </CardHeader>
        <Formik initialValues={initialValues} validationSchema={ResetPasswordSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, status, errors, touched }) => (
            <Form>
              <CardContent className="space-y-4">
                {status && (
                  <Alert variant={status.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      className={errors.password && touched.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className={errors.confirmPassword && touched.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="p" className="text-sm text-red-500" />
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 font-medium mb-2">Password requirements:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains at least one letter</li>
                    <li>• Contains at least one number</li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link href={LOGIN} className="text-blue-600 hover:underline">
                    Back to Login
                  </Link>
                </p>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}