"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { ForgotPasswordFormValues, ForgotPasswordSchema } from "@/lib/validation/auth"

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false)

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  }

  const handleSubmit = async (values: ForgotPasswordFormValues, { setSubmitting, setStatus }: any) => {
    try {
      console.log("Reset password email sent to:", values.email)
      setEmailSent(true)
      setStatus({ type: "success", message: "Password reset email sent successfully!" })
    } catch (error) {
      setStatus({ type: "error", message: "Failed to send reset email. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700">Email Sent!</h2>
              <p className="text-gray-600">
                We've sent a password reset link to your email address. Please check your inbox and follow the
                instructions to reset your password.
              </p>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => setEmailSent(false)}>
                  Send Another Email
                </Button>
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
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
            <Mail className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
          <CardDescription className="text-center">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <Formik initialValues={initialValues} validationSchema={ForgotPasswordSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, status, errors, touched }) => (
            <Form>
              <CardContent className="space-y-4">
                {status && (
                  <Alert variant={status.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className={errors.email && touched.email ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="email" component="p" className="text-sm text-red-500" />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}