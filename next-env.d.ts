/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg" {
  import { FC } from "react";
  const component: FC;
  export default component;
}
