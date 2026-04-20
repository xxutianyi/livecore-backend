import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { FormFieldText } from '@/components/winglab/form';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';

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
                <Form action="/profile" method="PUT">
                    <FieldGroup>
                        <FormFieldText name="name" label="名字" defaultValue={auth.user?.name} />
                        <FormFieldText name="phone" label="手机号" defaultValue={auth.user?.phone} />
                        <FormFieldText name="email" label="电子邮箱" defaultValue={auth.user?.email} />
                    </FieldGroup>
                </Form>
            </CardContent>
        </Card>
    );
}
