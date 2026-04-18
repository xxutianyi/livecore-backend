import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { FormFieldMutiSelect, FormFieldSelect, FormFieldText } from '@/components/winglab/form';
import { User } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

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
                    action={route('admin.settings.users.store')}
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
                        <FormFieldSelect
                            name="role"
                            label="用户角色"
                            defaultValue="director"
                            options={[
                                { label: '系统管理员', value: 'admin' },
                                { label: '直播间导播', value: 'director' },
                            ]}
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>编辑用户</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>编辑用户</DialogHeader>
                <Form
                    action={route('admin.settings.users.update', user.id)}
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
                        <FormFieldSelect
                            name="role"
                            label="用户角色"
                            defaultValue={user.role}
                            options={[
                                { label: '系统管理员', value: 'admin' },
                                { label: '导播/直播间管理', value: 'director' },
                            ]}
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
                <Button>编辑分组</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>批量移动到...</DialogHeader>
                <Form
                    action={route('admin.live.users.batch.group')}
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
