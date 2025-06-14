"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { RegisterFormValues, RegisterSchema } from "@/lib/validation/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import api from "@/api/auth"
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const initialValues: RegisterFormValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  }

 const handleSubmit = async (values: RegisterFormValues, { setSubmitting, setStatus }: any) => {
  try {

    const payload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      agreeTerms: values.agreeTerms
    }

    const response = await api.post("/auth/signup", payload);
    router.push(`/verify-email`);



    setStatus({
      type: "success",
      message: response.data.msg || "Registration successful! Please check your email to verify your account.",
    })

  } catch (error: any) {
    setStatus({
      type: "error",
      message: error?.response?.data?.msg || "Registration failed. Please try again."
    })
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your information to create a new account</CardDescription>
        </CardHeader>
        <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, status, errors, touched }) => (
            <Form>
              <CardContent className="space-y-4">
                {status && (
                  <Alert variant={status.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Field
                    as={Input}
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    className={errors.fullName && touched.fullName ? "border-red-500" : ""}
                  />
                  <ErrorMessage name="fullName" component="p" className="text-sm text-red-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
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

                <div className="flex items-center space-x-3 py-4">
                  <Field type="checkbox" id="agreeTerms" name="agreeTerms" className="rounded border-gray-300" />
                  <Label htmlFor="agreeTerms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>
                  </Label>
                </div>
                <ErrorMessage name="agreeTerms" component="p" className="text-sm text-red-500" />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Sign in
                  </a>
                </p>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}