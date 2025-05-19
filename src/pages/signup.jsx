import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !username) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username, // Include username in the request body
        }),
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        localStorage.setItem("isRegistered", "true"); // Set registration state
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        setError(data.error || "Signup failed. Please try again."); // Use the error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        theme === "dark" ? "bg-[var(--background)]" : "bg-gray-100"
      }`}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="rounded-xl">
          <CardTitle className="text-2xl font-bold">Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="block text-left w-full pl-2">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`${
                  theme === "dark" ? "border-[var(--border-dark-card)]" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-left w-full pl-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${
                  theme === "dark" ? "border-[var(--border-dark-card)]" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="block text-left w-full pl-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${
                  theme === "dark" ? "border-[var(--border-dark-card)]" : ""
                }`}
              />
            </div>
            <Button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 ${
                theme === "dark" ? "text-white" : ""
              }`}
            >
              Signup
            </Button>
          </form>
        </CardContent>
        <CardFooter className="rounded-xl">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
