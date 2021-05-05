import React from "react";
import { useSession, signIn, signOut } from "next-auth/client";

export default function Home() {
  const [session] = useSession();

  if (!session)
    return (
      <div>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  else
    return (
      <div>
        <form
          method="post"
          encType="multipart/form-data"
          action="/api/image/upload"
        >
          <input type="file" name="image" id="image-input" accept="image/*" />
          <button>Upload</button>
        </form>

        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
}
