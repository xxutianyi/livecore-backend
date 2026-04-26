import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { TextField } from '@/components/winglab/form';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export function ProfileForm() {
    const { auth } = usePage<SharedProps>().props;

    if (!auth.user) return;

    return (
        <Card>
            <CardHeader>
                <CardTitle>账号信息</CardTitle>
                <CardDescription>修改后请使用新信息登录</CardDescription>
            </CardHeader>
            <CardContent className="mx-auto w-full max-w-lg">
                <Form
                    action={route('profile.update')}
                    method="PUT"
                    onSuccess={() => {
                        toast.success('更新成功');
                    }}
                >
                    <FieldGroup>
                        <TextField name="name" label="名字" defaultValue={auth.user?.name} />
                        <TextField name="phone" label="手机号" defaultValue={auth.user?.phone} />
                        <TextField name="email" label="电子邮箱" defaultValue={auth.user?.email} />
                        <Field>
                            <Button type="submit">更新</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </CardContent>
        </Card>
    );
}
