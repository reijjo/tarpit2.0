"use server";
import * as z from "zod";

import { RegisterSchema } from "../schemas/auth";
import { RegisterState } from "../types/auth";

export async function registerEmail(
  _prevState: RegisterState,
  data: FormData,
): Promise<RegisterState> {
  const email = data.get("email");

  const result = RegisterSchema.pick({ email: true }).safeParse({ email });

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);

    return {
      success: false,
      errors: fieldErrors,
    };
  } else {
    return { success: true, email: result.data.email };
  }
}
