"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { officeSetupSchema, type OfficeSetupFormData } from "@/lib/validations";

export function OfficeSetupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OfficeSetupFormData>({
    resolver: zodResolver(officeSetupSchema),
  });

  const onSubmit = async (data: OfficeSetupFormData) => {
    const supabase = createClient();
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("ユーザーが認証されていません");

      const response = await fetch("/api/v1/offices/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: data.name,
          office_type: data.office_type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "事業所の作成に失敗しました");
      }

      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">事業所設定</CardTitle>
          <CardDescription>所属する事業所を登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">事業所名</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="事業所名を入力してください"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="office_type">事業所種別</Label>
                <Controller
                  name="office_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="事業所種別を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transition_to_employment">
                          就労移行支援
                        </SelectItem>
                        <SelectItem value="type_A_office">
                          就労継続支援A型
                        </SelectItem>
                        <SelectItem value="type_B_office">
                          就労継続支援B型
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.office_type && (
                  <p className="text-sm text-red-500">
                    {errors.office_type.message}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "事業所作成中..." : "事業所を作成"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}