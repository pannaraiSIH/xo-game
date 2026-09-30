"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const router = useRouter();

  function handleGoogleLogin() {
    router.push(`${process.env.NEXT_PUBLIC_API_URL!}/auth/google`);
  }

  return (
    <div className="min-h-screen grid place-items-center p-10 bg-[#F7F7F8]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Tic-Tac-Toe</CardTitle>
          <CardDescription className="text-center">
            Sign in to play against the bot and save your score.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 size-5" />
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
