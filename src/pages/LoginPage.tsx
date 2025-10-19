import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Wrench, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onNavigate: (page: string, role?: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Mock login - in real app, would validate credentials
    // For demo: admin@dpr.edu -> admin, instructor@dpr.edu -> instructor
    if (email.includes("admin")) {
      onNavigate("admin-dashboard", "admin");
    } else {
      onNavigate("instructor-dashboard", "instructor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => onNavigate('landing')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Login Card */}
        <Card className="shadow-2xl bg-gradient-to-br from-white to-blue-50/30 border-blue-100">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access the DTMS dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@dpraviation.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input-background"
                />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
              onClick={handleLogin}
            >
              Login
            </Button>

            <div className="text-center">
              <button className="text-sm text-blue-700 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="p-4 bg-blue-50 rounded-lg text-sm">
              <p className="text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-muted-foreground text-xs">Admin: admin@dpr.edu</p>
              <p className="text-muted-foreground text-xs">Instructor: instructor@dpr.edu</p>
              <p className="text-muted-foreground text-xs">Password: any</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
