export const SHAPES = ["Sphere", "Torus knot", "Galaxy", "Wave"] as const;
export type Shape = (typeof SHAPES)[number];
