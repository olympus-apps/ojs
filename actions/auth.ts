"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { setSession, clearSession, roleToDashboardPath } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) {
    return false;
  }
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}

function normalizeRole(role: FormDataEntryValue | null): Role {
  if (role === Role.REVIEWER) {
    return Role.REVIEWER;
  }
  return Role.AUTHOR;
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = normalizeRole(formData.get("role"));

  if (!name || !email || !password) {
    redirect("/register?error=All+fields+are+required");
  }

  if (password.length < 6) {
    redirect("/register?error=Password+must+be+at+least+6+characters");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/register?error=Email+already+registered");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword(password),
      role,
    },
  });

  await setSession(user.id);
  redirect(roleToDashboardPath(user.role));
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=Email+and+password+are+required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.password)) {
    redirect("/login?error=Invalid+credentials");
  }

  await setSession(user.id);
  redirect(roleToDashboardPath(user.role));
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
