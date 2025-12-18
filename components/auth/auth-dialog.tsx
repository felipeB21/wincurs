import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

export function SignUpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">wincurs</DialogTitle>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>Create an account to access all</DialogDescription>
        </DialogHeader>
        <SignUp />
      </DialogContent>
    </Dialog>
  );
}

export function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">wincurs</DialogTitle>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Create an account to access all</DialogDescription>
        </DialogHeader>
        <SignIn />
      </DialogContent>
    </Dialog>
  );
}
