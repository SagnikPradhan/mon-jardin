import React, { useState } from "react";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/client";

export default function Home() {
  const [session] = useSession();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const newFiles = Object.values(event.dataTransfer.files);
    setFiles((files) => removeCopies([...files, ...newFiles]));
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFiles = Object.values(event.target.files || {});
    if (newFiles.length > 0)
      setFiles((files) => removeCopies([...files, ...newFiles]));
  };

  const removeCopies = (files: File[]) =>
    Object.values(Object.fromEntries(files.map((file) => [file.name, file])));

  const upload = () => {
    console.log("Uploading data");

    const body = new FormData();
    for (const file of files) body.append("image", file.slice(), file.name);

    fetch("/api/image/upload", {
      method: "POST",
      body,
    })
      .then((response) => {
        if (response.ok) setFiles(() => []);
        else console.log(response);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Work+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Layout>
        {session ? (
          <Card>
            <h1 className="font-bold text-3xl font-montserrat my-12">
              Upload your Images
            </h1>

            <div
              onDrop={onDrop}
              onDragOverCapture={(e) => e.preventDefault()}
              className="
                bg-snow bg-opacity-60
                  min-w-full mb-8 p-8
                  flex flex-col items-center justify-center gap-2
                "
            >
              <div className="max-h-24 overflow-y-auto">
                <ul>
                  {files.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>

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
                <input
                  type="file"
                  multiple
                  id="file-input"
                  className="hidden"
                  onChange={onInputChange}
                />
                Browse files
              </label>
            </div>

            <button
              className="
                bg-snow bg-opacity-40 hover:shadow
                font-semibold font-montserrat px-12 py-4 mt-4
              "
              disabled={files.length === 0}
              onClick={upload}
            >
              Upload
            </button>

            <button
              className="
                bg-black text-snow hover:shadow
                font-semibold font-montserrat px-12 py-4 mt-4
              "
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </Card>
        ) : (
          <Card>
            <h3 className="font-montserrat font-semibold">Mon Jardin</h3>

            <h1 className="font-montserrat font-bold text-3xl my-10">
              You are not signed in
            </h1>

            <button
              onClick={() => signIn("discord")}
              className="
              px-12 py-4 bg-black text-snow mt-4 font-semibold font-montserrat
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
