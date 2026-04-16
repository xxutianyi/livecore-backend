import { Description, DescriptionItem } from '@/components/description';
import { FormFieldText } from '@/components/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { formatDate, formatDatetime } from '@/lib/utils';
import { User } from '@/services/model';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserDetail({ user }: { user: User }) {
    return (
        <>
            <div className="flex items-center justify-between font-heading text-base font-bold">
                <span>用户信息</span>
                <UserUpdate user={user} />
            </div>
            <Description>
                <DescriptionItem label="姓名">{user.name}</DescriptionItem>
                <DescriptionItem label="手机号">
                    <span className="flex items-center gap-x-2">
                        {user.phone}
                        {user.phone && user.phone_verified_at ? (
                            <Badge>已验证</Badge>
                        ) : (
                            <Badge variant="destructive">未验证</Badge>
                        )}
                    </span>
                </DescriptionItem>
                <DescriptionItem label="电子邮件">
                    <span className="flex items-center gap-x-2">
                        {user.email}
                        {user.email && user.email_verified_at ? (
                            <Badge>已验证</Badge>
                        ) : (
                            <Badge variant="destructive">未验证</Badge>
                        )}
                    </span>
                </DescriptionItem>
                <DescriptionItem label="邀请人代码">{user.invitation_code}</DescriptionItem>
                <DescriptionItem label="注册日期">{formatDate(user.created_at)}</DescriptionItem>
                <DescriptionItem label="在线状态">
                    <span className="flex items-center gap-x-2">
                        <Badge variant={user.online ? 'default' : 'secondary'}>{user.online ? '在线' : '离线'}</Badge>
                    </span>
                </DescriptionItem>
                <DescriptionItem label="上次在线时间">{formatDatetime(user.leaving_at)}</DescriptionItem>
            </Description>
        </>
    );
}

export function UserCreate() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>新建用户</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>新建用户</DialogHeader>
                <Form
                    action={route('users.store')}
                    method="POST"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <FormFieldText name="name" label="姓名" />
                        <FormFieldText name="phone" label="手机号" />
                        <FormFieldText name="email" label="电子邮件" />
                        <FormFieldText name="invitation_code" label="邀请人代码" />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function UserUpdate({ user }: { user: User }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>编辑用户</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>编辑用户</DialogHeader>
                <Form
                    action={route('users.update', user.id)}
                    method="PUT"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <FormFieldText name="name" label="姓名" defaultValue={user.name} />
                        <FormFieldText name="phone" label="手机号" defaultValue={user.phone} />
                        <FormFieldText name="email" label="电子邮件" defaultValue={user.email} />
                        <FormFieldText name="invitation_code" label="邀请人代码" defaultValue={user.invitation_code} />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
