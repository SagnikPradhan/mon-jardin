import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  Redirect,
} from "next";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/client";
import { useRouter } from "next/router";

export default function DashboardPage({
  session: { user },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const signOutButtonOnClick = () => {
    signOut({
      redirect: false,
      callbackUrl: "/sign-in",
    }).then(({ url }) => router.push(url));
  };

  return (
    <div>
      <h1>Hey there {user?.name}</h1>
      <button onClick={signOutButtonOnClick}>Sign Out</button>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (session) return { props: { session } } as { props: { session: Session } };
  else
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    } as { redirect: Redirect };
}
