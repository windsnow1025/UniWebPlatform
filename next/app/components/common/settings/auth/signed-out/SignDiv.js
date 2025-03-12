import {Button} from "@mui/material";
import React from "react";
import {usePathname, useRouter} from "next/navigation";

function SignDiv() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignInRouter = () => {
    router.push(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
  };

  const handleSignUpRouter = () => {
    router.push(`/auth/signup?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <div className="flex-start-center">
      <div className="m-1">
        <Button
          color="secondary"
          variant="contained"
          onClick={handleSignInRouter}
        >
          Sign In
        </Button>
      </div>
      <div className="m-1">
        <Button
          color="secondary"
          variant="contained"
          onClick={handleSignUpRouter}
        >
          Sign Up
        </Button>
      </div>
    </div>
  )
}

export default SignDiv;