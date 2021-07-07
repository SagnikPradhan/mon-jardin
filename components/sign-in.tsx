import styled from "styled-components";
import { signIn } from "next-auth/client";

import DiscordLogo from "mon-jardin/public/discord-logo.svg";
import GoogleLogo from "mon-jardin/public/google-logo.svg";

import { SmallLogo } from "./logo";
import { ButtonGroup, Button, ButtonIcon, ButtonText } from "./button";

const SignInCardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-image: url(/william-f-santos-fh4EjSarMq8-unsplash.jpg);
  background-size: cover;

  z-index: 20;
`;

const SignInCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 30px 1px rgba(0, 0, 0, 0.15);

  padding: 2.5em;
  gap: 5em;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1em;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: bold;
  font-family: "Playfair Display", serif;
  margin: 0.5em;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: regular;
  font-family: "Montserrat", sans-serif;
  line-height: 1.6;
`;

export default function SignIn() {
  return (
    <SignInCardContainer>
      <SignInCard>
        <TitleGroup>
          <Title>Sign In</Title>

          <SubTitle>
            Time to grow the
            <br />
            Library
          </SubTitle>
        </TitleGroup>

        <ButtonGroup>
          <Button background="#7289DA" onClick={() => signIn("discord")}>
            <ButtonIcon height={28}>
              <DiscordLogo />
            </ButtonIcon>
            <ButtonText color="white">Sign in with discord</ButtonText>
          </Button>

          <Button onClick={() => signIn("google")}>
            <ButtonIcon height={22}>
              <GoogleLogo />
            </ButtonIcon>
            <ButtonText>Sign in with google</ButtonText>
          </Button>
        </ButtonGroup>

        <SmallLogo>Mon Jardin</SmallLogo>
      </SignInCard>
    </SignInCardContainer>
  );
}
