import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                登録ありがとうございます！
              </CardTitle>
              <CardDescription>メールを確認してアカウントを確認してください</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                登録先のメールアドレスに確認メールを送信しました。メール内のリンクをクリックして、アカウントを有効化してください。
                もしメールが届かない場合は、迷惑メールフォルダを確認するか、サポートにお問い合わせください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
