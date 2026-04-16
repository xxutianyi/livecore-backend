import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';

export function ProfileForm() {
    const { user } = usePage<SharedProps>().props;

    if (!user) return;

    return (
        <Card>
            <CardHeader>
                <CardTitle>账号信息</CardTitle>
                <CardDescription>修改后请使用新信息登录</CardDescription>
            </CardHeader>
            <CardContent className="mx-auto w-full max-w-lg">
                <Form action="/profile" method="PUT">
                    {({ errors }) => (
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">名字</FieldLabel>
                                <Input id="name" name="name" placeholder="请输入" defaultValue={user.name} />
                                {errors['name'] && <FieldError errors={[{ message: errors['name'] }]} />}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">手机号</FieldLabel>
                                <Input id="phone" name="phone" placeholder="请输入" defaultValue={user.phone} />
                                {errors['phone'] && <FieldError errors={[{ message: errors['phone'] }]} />}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">电子邮箱</FieldLabel>
                                <Input id="email" name="email" placeholder="请输入" defaultValue={user.email} />
                                {errors['email'] && <FieldError errors={[{ message: errors['email'] }]} />}
                            </Field>
                            <Field>
                                <Button type="submit">更新</Button>
                            </Field>
                        </FieldGroup>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
