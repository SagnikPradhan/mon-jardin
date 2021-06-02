import styled from "styled-components";

export const BackgroundLogo = styled.h4`
  position: absolute;
  left: 0;
  top: 0;

  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: center;

  overflow: hidden;

  font-size: 300px;
  font-weight: bold;
  font-family: "Playfair Display SC", serif;
  line-height: 0.758;
  color: #ffecec;

  z-index: 10;
`;

export const Logo = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 96px;
  font-weight: regular;
  font-family: "Playfair Display", serif;

  z-index: 30;
`;

export const SmallLogo = styled.h4`
  font-size: 14px;
  font-weight: regular;
  font-family: "Playfair Display", serif;
`;
