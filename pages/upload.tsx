import React from "react";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/client";

export default function Home() {
  const [session] = useSession();

  const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    console.log(event);
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Nunito&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Layout>
        {session ? (
          <Card>
            <h1 className="font-bold text-3xl font-montserrat my-14">
              Upload your Images
            </h1>

            <div
              onDrop={onDrop}
              className="
                bg-snow bg-opacity-60
                  min-w-full h-52 mb-8
                  flex flex-col items-center justify-center gap-2
                "
            >
              <span className="font-semibold">Drop images here</span>

              <span>OR</span>

              <label
                htmlFor="file-input"
                className="
                    px-12 py-4
                    bg-black bg-opacity-10
                    font-semibold
                  "
              >
                <input type="file" id="file-input" className="hidden" />
                Browse files
              </label>
            </div>

            <button
              className="
                  bg-snow bg-opacity-40 hover:shadow
                  font-semibold px-12 py-4 mt-4
                "
            >
              Upload
            </button>

            <button
              className="
                  bg-black text-snow hover:shadow
                  font-semibold px-12 py-4 mt-4
                "
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </Card>
        ) : (
          <Card>
            <h1 className="font-montserrat font-bold text-3xl my-10">
              You are not signed in
            </h1>

            <button
              onClick={() => signIn("discord")}
              className="
              px-12 py-4 bg-black text-snow mt-4 font-semibold
            "
            >
              Sign In
            </button>
          </Card>
        )}
      </Layout>
    </>
  );
}

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
      w-screen min-h-screen
      flex flex-col items-center justify-center
      bg-gray bg-purple-beauty bg-cover bg-no-repeat
    "
  >
    {children}
  </div>
);

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
    flex flex-col items-center justify-center 
    shadow-lg rounded-sm p-8 m-8 
    backdrop-filter backdrop-blur bg-snow bg-opacity-60
  "
  >
    {children}
  </div>
);
