import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LOGIN } from "@/lib/constant/Route"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Workino</h1>
        <p className="text-gray-600 mb-6">Your all-in-one workspace for notes, tasks, and collaboration</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Get started</CardTitle>
          <CardDescription>Choose an option to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href={LOGIN} className="w-full">
            <Button className="w-full" variant="outline">
              Log in
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button className="w-full">
              Sign up for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  )
}
