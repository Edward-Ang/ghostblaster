import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IgHeader from "@/components/ig-header";
import { Camera, Mail, User, Lock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProfilePage() {
  const { theme } = useTheme(); // Get the current theme
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "https://github.com/shadcn.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/users/${userId}`);
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setFormData(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/users/${userId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  return (
    <div
      className={`flex flex-col w-full min-h-screen ${
        theme === "dark" ? "bg-[var(--background)]" : "bg-gray-50"
      }`}
    >
      <IgHeader />
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-36 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative h-32 w-32">
                <Avatar className="h-32 w-32 ring-2 ring-white">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="rounded-lg object-cover"
                  />
                  <AvatarFallback className="bg-gray-200">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Settings */}
              <Card className="shadow-sm">
                <CardHeader
                  className={`border-b rounded-t-xl ${
                    theme === "dark"
                      ? "border-[var(--border-dark-card)]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                      Profile Settings
                    </CardTitle>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className={`${
                          theme === "dark"
                            ? "border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-white"
                        >
                          Full Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            value={isEditing ? formData.name : user.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`pl-10 ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          />
                          <User className="w-5 h-5 text-gray-400 absolute left-3 top-2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-white"
                        >
                          Email Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={isEditing ? formData.email : user.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`pl-10 ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          />
                          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2" />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4 pt-4 border-t">
                        <Button
                          type="submit"
                          className={`bg-blue-600 hover:bg-blue-700 ${
                            theme === "dark" ? "text-white" : ""
                          }`}
                        >
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(user);
                          }}
                          className={`${
                            theme === "dark"
                              ? "border-[var(--border-dark-card)]"
                              : ""
                          }`}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card className="shadow-sm">
                <CardHeader
                  className={`border-b rounded-t-xl ${
                    theme === "dark"
                      ? "border-[var(--border-dark-card)]"
                      : "border-gray-200"
                  }`}
                >
                  <CardTitle className="text-xl font-semibold">
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="text-sm font-medium text-white"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            className={`pl-10 ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          />
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="text-sm font-medium text-white"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            className={`pl-10 ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          />
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-white"
                        >
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`pl-10 ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          />
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        type="submit"
                        className={`bg-blue-600 hover:bg-blue-700 ${
                          theme === "dark" ? "text-white" : ""
                        }`}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
