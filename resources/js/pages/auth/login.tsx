import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/layouts/auth-layout';
import { SiApple, SiWechat } from '@icons-pack/react-simple-icons';
import { Form, Link } from '@inertiajs/react';

export default function login() {
    return (
        <AuthLayout>
            <Form className="p-6 md:p-8" action="/login" method="POST">
                {({ errors }) => (
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-2xl font-bold">登录账号</h1>
                            <p className="text-sm text-balance text-muted-foreground">使用用户名/邮箱/手机号登录</p>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="username">用户名</FieldLabel>
                            <Input id="username" name="username" placeholder="请输入" />
                            {errors['username'] && <FieldError errors={[{ message: errors['username'] }]} />}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">密码</FieldLabel>
                            <Input id="password" type="password" name="password" placeholder="请输入" />
                            {errors['password'] && <FieldError errors={[{ message: errors['password'] }]} />}
                        </Field>
                        <Field>
                            <Button type="submit">登录</Button>
                        </Field>
                        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                            其他登录方式
                        </FieldSeparator>
                        <Field className="grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button">
                                <SiApple />
                            </Button>
                            <Button variant="outline" type="button">
                                <SiWechat />
                            </Button>
                        </Field>
                        <FieldDescription className="text-center">
                            <Link href="/sign-up">没有账号，去注册</Link>
                        </FieldDescription>
                    </FieldGroup>
                )}
            </Form>
        </AuthLayout>
    );
}
