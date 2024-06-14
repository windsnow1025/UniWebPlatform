import {Button} from "@mui/material";
import React from "react";
import {usePathname, useRouter} from "next/navigation";

function SignDiv() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignInRouter = () => {
    localStorage.setItem('prevUrl', pathname);
    router.push('/user/state/signin');
  };

  const handleSignUpRouter = () => {
    localStorage.setItem('prevUrl', pathname);
    router.push('/user/state/signup');
  };

  return (
    <div className="flex-around">
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