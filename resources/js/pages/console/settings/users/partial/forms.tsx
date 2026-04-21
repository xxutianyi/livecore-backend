import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { FormFieldMutiSelect, FormFieldText } from '@/components/winglab/form';
import { User } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function UserCreate() {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>新建用户</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>新建用户</DialogTitle>
                    <DialogDescription>默认密码 Password!@ ，请提示用户修改</DialogDescription>
                </DialogHeader>
                <Form
                    action={route('settings.users.store')}
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
                        <FormFieldMutiSelect
                            label="分组"
                            name="group_ids"
                            options={options.groups}
                            optionsKey={{ label: 'name', value: 'id' }}
                        />
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

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>编辑用户</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑用户</DialogTitle>
                </DialogHeader>
                <Form
                    action={route('settings.users.update', user.id)}
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
                        <FormFieldMutiSelect
                            label="分组"
                            name="group_ids"
                            options={options.groups}
                            optionsKey={{ label: 'name', value: 'id' }}
                            defaultValue={user.groups?.map((g) => g.id)}
                        />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function UserBatchGroup({ ids }: { ids: string[] }) {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>批量分组</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>批量移动到...</DialogTitle>
                </DialogHeader>
                <Form
                    action={route('settings.users.batch.group')}
                    method="POST"
                    transform={(data) => ({ ...data, user_ids: ids })}
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <FormFieldMutiSelect
                            name="group_ids"
                            options={options.groups}
                            optionsKey={{ label: 'name', value: 'id' }}
                        />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
