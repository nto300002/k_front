import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください")
    .refine((email) => {
      const domain = email.split("@")[1];
      return domain && (domain.endsWith(".com") || domain.endsWith(".jp"));
    }, "メールアドレスは.comまたは.jpで終わる必要があります"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上である必要があります")
    .regex(/[A-Z]/, "パスワードには大文字が含まれている必要があります")
    .regex(/[a-z]/, "パスワードには小文字が含まれている必要があります")
    .regex(/[0-9]/, "パスワードには数字が含まれている必要があります")
    .regex(/[^A-Za-z0-9]/, "パスワードには記号が含まれている必要があります"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "名前は3文字以上である必要があります")
      .max(50, "名前は50文字以下である必要があります"),
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("有効なメールアドレスを入力してください")
      .refine((email) => {
        const domain = email.split("@")[1];
        return domain && (domain.endsWith(".com") || domain.endsWith(".jp"));
      }, "メールアドレスは.comまたは.jpで終わる必要があります"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上である必要があります")
      .regex(/[A-Z]/, "パスワードには大文字が含まれている必要があります")
      .regex(/[a-z]/, "パスワードには小文字が含まれている必要があります")
      .regex(/[0-9]/, "パスワードには数字が含まれている必要があります")
      .regex(/[^A-Za-z0-9]/, "パスワードには記号が含まれている必要があります"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "パスワードが一致しません",
    path: ["repeatPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;