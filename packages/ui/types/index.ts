import { FC, PropsWithChildren } from "react";

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P = {}> = FC<P & { children: JSX.Element | JSX.Element[] }>;

export { MantineColor } from "@mantine/core"
