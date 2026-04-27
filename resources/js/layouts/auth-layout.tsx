import { Card, CardContent } from '@/components/ui/card';
import { FieldDescription } from '@/components/ui/field';
import configs from '@/lib/configs';
import { PropsWithChildren } from 'react';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="relative hidden bg-muted md:block">
                <img
                  alt="Image"
                  src={configs.APP_LOGIN_IMAGE}
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            继续登录/注册即表示您已阅读并同意 <a href="#">服务协议</a> 和 <a href="#">隐私政策</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
