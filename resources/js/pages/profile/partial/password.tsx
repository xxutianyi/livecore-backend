import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Form } from '@inertiajs/react';

export function PasswordForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>修改密码</CardTitle>
                <CardDescription>修改后请使用新信息登录</CardDescription>
            </CardHeader>
            <CardContent className="mx-auto w-full max-w-lg">
                <Form action="/password" method="PUT">
                    {({ errors }) => (
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="current_password">当前密码</FieldLabel>
                                <Input
                                    id="current_password"
                                    name="current_password"
                                    placeholder="请输入"
                                    type="password"
                                />
                                {errors['current_password'] && (
                                    <FieldError errors={[{ message: errors['current_password'] }]} />
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="new_password">新密码</FieldLabel>
                                <Input id="new_password" name="new_password" placeholder="请输入" type="password" />
                                {errors['new_password'] && (
                                    <FieldError errors={[{ message: errors['new_password'] }]} />
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="new_password_confirmation">再次输入新密码</FieldLabel>
                                <Input
                                    id="new_password_confirmation"
                                    name="new_password_confirmation"
                                    placeholder="请输入"
                                    type="password"
                                />
                                {errors['new_password_confirmation'] && (
                                    <FieldError errors={[{ message: errors['new_password_confirmation'] }]} />
                                )}
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
