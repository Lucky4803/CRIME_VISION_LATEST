import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to continue",
        variant: "destructive",
      });
      return;
    }

    // Store user session
    localStorage.setItem("crime-vision-user", email);
    
    toast({
      title: "Welcome to Crime Vision",
      description: "Successfully signed in to the surveillance system",
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border shadow-card relative z-10">
        <CardHeader className="text-center pb-8">
          <Logo size="lg" />
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Access the AI Surveillance System</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50 border-border focus:border-primary transition-smooth"
                onKeyPress={(e) => e.key === "Enter" && handleSignIn()}
              />
            </div>
            
            <Button 
              onClick={handleSignIn}
              variant="glow"
              className="w-full text-lg py-6"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to Crime Vision?{" "}
              <button 
                onClick={handleSignIn}
                className="text-primary hover:text-primary-glow transition-smooth underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              AI-Powered Surveillance • Real-time Threat Detection
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;