import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingUsers, setHasExistingUsers] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there are existing users
    const checkExistingUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (!error && data && data.length > 0) {
        setHasExistingUsers(true);
      }
    };
    checkExistingUsers();
  }, []);

  const handleAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First, sign up the user
      const { error: signUpError } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        is_admin_setup: true,
        organization_name: organizationName
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      toast({
        title: "Admin account created!",
        description: "Check your email for the confirmation link, then you'll be able to sign in as an administrator.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      setError(error.message || "An error occurred during setup");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasExistingUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-carbon via-carbon/95 to-carbon/90 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Setup Complete</CardTitle>
            <CardDescription>
              This system has already been set up. Please use the regular login page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-carbon via-carbon/95 to-carbon/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-carbon-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to ComplyEasy</span>
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-carbon-foreground">ComplyEasy</h1>
          </div>
          <p className="text-carbon-foreground/80">Set up your first administrator account</p>
        </div>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Setup</CardTitle>
            <CardDescription className="text-center">
              Create the first administrator account for your ComplyEasy system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="Your organization name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Administrator Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Admin Account..." : "Set Up Administrator"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center mb-2">
                <strong>Important:</strong> This will create the first administrator account.
              </p>
              <p className="text-xs text-muted-foreground text-center">
                You'll receive an email confirmation link before you can sign in.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;