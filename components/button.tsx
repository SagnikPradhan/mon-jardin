import styled from "styled-components";

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5em;
`;

export const Button = styled.button<{ background?: string }>`
  padding: 1em 1.5em;
  border: none;
  border-radius: 4px;

  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: 0 2px 15px 1px rgba(0, 0, 0, 0.15);
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1ch;

  background: ${({ background }) => (background ? background : "white")};
`;

export const ButtonIcon = styled.span<{ height: number }>`
  & > svg {
    height: ${({ height }) => height}px;
  }
`;

export const ButtonText = styled.span<{ color?: string }>`
  font-size: 14px;
  font-weight: regular;
  font-family: "Roboto", sans-serif;

  color: ${({ color }) => (color ? color : "black")};
`;
