import React, { useEffect } from "react";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/client";

export default function Home() {
  const [session] = useSession();

  const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    console.log(event);
  };

  if (!session)
    return (
      <Layout>
        <h1 className="">You are not signed in</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </Layout>
    );
  else
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
          <div className="bg-white flex flex-col items-center justify-center rounded-2xl shadow-lg px-6">
            <h1 className="font-bold text-3xl font-montserrat my-20 mx-12">
              Upload your Images
            </h1>

            <div
              onDrop={onDrop}
              className="min-w-full h-52 rounded-xl bg-gray-50 flex flex-col items-center justify-center border-solid border-gray-200 border-2 m-4 mt-0"
            >
              Drag and Drop Items here
            </div>

            <button className="bg-blue-200 px-20 py-3 rounded-md text-black hover:bg-blue-500 hover:text-white hover:shadow my-4">
              Upload
            </button>

            <button
              className="bg-pink-200 px-20 py-3 rounded-md text-black hover:bg-red-500 hover:text-white hover:shadow mb-10"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        </Layout>
      </>
    );
}

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-50">
    {children}
  </div>
);
