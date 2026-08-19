/**
 * Stagger step for the page's single reveal: 60ms per item, flattened after
 * the fourth so a long list never trails the fold.
 *
 * Lives outside Rise.tsx on purpose — Rise is a client component, and a plain
 * function exported from a "use client" module becomes a client reference the
 * server can render but not call. The sections that use this are server
 * components.
 */
export const step = (i: number) => Math.min(i, 3) * 0.06;
