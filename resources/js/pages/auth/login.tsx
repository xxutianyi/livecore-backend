import { PasswordField, TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { AuthLayout } from '@/layouts/auth-layout';
import { Form, Link } from '@inertiajs/react';

export default function login() {
  return (
    <AuthLayout>
      <Form className="p-6 md:p-8" action="/login" method="POST">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">登录账号</h1>
            <p className="text-sm text-balance text-muted-foreground">使用用户名/邮箱/手机号登录</p>
          </div>
          <TextField name="username" label="用户名" placeholder="请输入" />
          <PasswordField name="password" label="密码" placeholder="请输入" />

          <Field>
            <Button type="submit">登录</Button>
          </Field>
          <FieldDescription className="text-center">
            <Link href="/register">没有账号，去注册</Link>
          </FieldDescription>
        </FieldGroup>
      </Form>
    </AuthLayout>
  );
}
