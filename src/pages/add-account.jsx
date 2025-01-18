// src/pages/Login.jsx
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
import { CgSpinnerAlt } from "react-icons/cg";
import BsHeader from "@/components/bs-header";

function AddAccount({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Simulate a login request
    try {
      const response = await fakeLoginApi(email, password);
      if (response.success) {
        localStorage.setItem("isAuthenticated", "true"); // Set authentication state
        setIsAuthenticated(true); // Update authentication state in App.js
        navigate("/home"); // Redirect to home page after successful login
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const fakeLoginApi = (email, password) => {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "testing@gmail.com" && password === "123") {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <BsHeader />
      <div className="flex-grow flex flex-col justify-center items-center pb-16">
        {error && (
          <Alert className="w-fit mb-4 bg-yellow-100 border-yellow-400 text-yellow-700 py-4 rounded-lg flex items-center">
            <CgSpinnerAlt className="animate-spin mt-1 text-lg" />
            <AlertDescription className="flex items-center mt-1">
              Please approve the login request in your Facebook notifications
            </AlertDescription>
          </Alert>
        )}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add Facebook Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="block text-left w-full pl-2"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {/* <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AddAccount;
