import type { Form, FormResponse } from "@shared/types";

export type Db = {
  forms: Map<string, Form>;
  responses: Map<string, FormResponse[]>;
};

export const db: Db = { forms: new Map(), responses: new Map() };

export function nowIso(): string {
  return new Date().toISOString();
}

export function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
