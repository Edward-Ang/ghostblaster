import { useState, useEffect } from "react"; // Import useEffect
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

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(""); // State for isRegistered
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Fetch the value of isRegistered from localStorage when the component mounts
  useEffect(() => {
    const isRegistered = localStorage.getItem("isRegistered");
    if (isRegistered) {
      setRegistered(isRegistered); // Set the state with the value from localStorage
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json(); // Parse the JSON response

      if (data.status) {
        localStorage.setItem("isAuthenticated", "true"); // Set authentication state
        localStorage.setItem("userId", data.userData.userId);
        localStorage.setItem("username", data.userData.username);
        localStorage.setItem("email", data.userData.email);
        setIsAuthenticated(true); // Update authentication state in App.js
        localStorage.removeItem("isRegistered"); // Remove isRegistered from localStorage
        navigate("/home"); // Redirect to home page after successful login
      } else {
        setError(data.message || "Invalid email or password"); // Use the error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleSignUpClick = () => {
    localStorage.removeItem("isRegistered"); // Remove isRegistered from localStorage
    navigate("/signup"); // Navigate to the signup page
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        theme === "dark" ? "bg-[var(--background)]" : "bg-gray-100"
      }`}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="rounded-xl">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display a success message if the user just registered */}
          {registered && (
            <Alert className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <AlertDescription className="text-green-700">
                Registration successful! Please log in.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="rounded-xl">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={handleSignUpClick}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
