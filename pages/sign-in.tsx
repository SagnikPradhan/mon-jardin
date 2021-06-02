import styled from "styled-components";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/client";

import SignIn from "mon-jardin/components/sign-in";
import { Logo, BackgroundLogo } from "mon-jardin/components/logo";

const Container = styled.div`
  display: grid;
  height: 100vh;

  grid-template-columns: 55% 45%;
  grid-template-rows: 100vh;
`;

export default function SignInPage() {
  return (
    <Container>
      <Logo>Mon Jardin</Logo>

      <SignIn></SignIn>

      <BackgroundLogo>Mon Jardin</BackgroundLogo>
    </Container>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  else return { props: {} };
}
