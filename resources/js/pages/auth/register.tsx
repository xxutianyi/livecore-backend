import { PasswordField, TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { AuthLayout } from '@/layouts/auth-layout';
import { Form, Link } from '@inertiajs/react';

export default function Register() {
  return (
    <AuthLayout>
      <Form className="p-6 md:p-8" action="/register" method="POST">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">注册新账号</h1>
          </div>
          <TextField name="name" label="名字" placeholder="请输入" />
          <TextField name="invitation_code" label="邀请码" placeholder="请输入" />
          <TextField name="phone" label="手机号" placeholder="请输入" />
          <PasswordField name="password" label="密码" placeholder="请输入" />
          <PasswordField name="password_confirmation" label="确认密码" placeholder="请输入" />

          <Field>
            <Button type="submit">注册</Button>
          </Field>
          <FieldDescription className="text-center">
            <Link href="/login">已有账号，去登录</Link>
          </FieldDescription>
        </FieldGroup>
      </Form>
    </AuthLayout>
  );
}
