import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="min-h-screen grid place-items-center p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Welcome to XO Arena</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            <FcGoogle className="mr-2 size-5" />
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
