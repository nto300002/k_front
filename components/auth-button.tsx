import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { User } from '@supabase/supabase-js';

export async function AuthButton({ user: initialUser }: { user: User | null }) {

  const supabase = await createClient();
  console.log("AuthButton: user", initialUser);

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getUser();

  const user = data?.user;
  console.log("AuthButton: user from getUser", data);

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
