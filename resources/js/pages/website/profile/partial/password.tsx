import { TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { Form } from '@inertiajs/react';

export function PasswordForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>修改密码</CardTitle>
        <CardDescription>修改后请使用新信息登录</CardDescription>
      </CardHeader>
      <CardContent className="mx-auto w-full max-w-lg">
        <Form action={route('password.update')} method="PUT">
          <FieldGroup>
            <TextField name="current_password" label="当前密码" type="password" />
            <TextField name="password" label="新密码" type="password" />
            <TextField name="password_confirmation" label="再次输入新密码" type="password" />
            <Field>
              <Button type="submit">更新</Button>
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  );
}
