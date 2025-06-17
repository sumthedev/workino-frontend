"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { LoginFormValues, LoginSchema } from "@/lib/validation/auth"
import api from "@/api/auth"
import { useRouter } from "next/navigation"
import { DASHBOARD, FORGET_PASSWORD, LOGIN, ONBOARDING, REGISTER } from "@/lib/constant/Route"
import Link from "next/link"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
    rememberMe: false,
  }

  const handleSubmit = async (values: LoginFormValues, { setSubmitting, setStatus }: any) => {
    try {
     
      const payload = {
      email: values.email,
      password: values.password,
      }

      const response = await api.post("/auth/login", payload);
      const token = response.data.token;
      localStorage.setItem('token', token);

      setStatus({
      type: "success",
      message: response.data.msg || "Login Successfull",

    })

     router.push(ONBOARDING)

    } catch (error) {
      setStatus({ type: "error", message: "Invalid email or password. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, status, errors, touched, values, setFieldValue }) => (
            <Form>
              <CardContent className="space-y-4">
                {status && (
                  <Alert variant={status.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}

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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={values.rememberMe}
                      onCheckedChange={(checked) => setFieldValue("rememberMe", checked)}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href={FORGET_PASSWORD} className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  {"Don't have an account? "}
                  <Link href={REGISTER} className="text-blue-600 hover:underline">
                    Sign up
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