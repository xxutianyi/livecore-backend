import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { MutiSelectField, TextField } from '@/components/winglab/form';
import { UserGroup } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function GroupIndex() {
    const { options } = usePage<SharedProps>().props;

    const columns = defineColumns<UserGroup>([
        {
            dataKey: 'name',
            title: '名字',
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return <GroupUpdate group={data} />;
            },
        },
    ]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>用户分组</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl!" showCloseButton={false}>
                <DialogHeader className="mb-4 flex flex-row items-center justify-between">
                    <DialogTitle>用户分组</DialogTitle>
                    <GroupCreate />
                </DialogHeader>
                <SimpleTable columns={columns} data={options.groups as UserGroup[]} />
            </DialogContent>
        </Dialog>
    );
}

export function GroupCreate() {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>新建分组</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>新建分组</DialogTitle>
                </DialogHeader>
                <Form
                    action={route('settings.groups.store')}
                    method="POST"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <TextField name="name" label="名称" />
                        <MutiSelectField
                            label="授权直播间"
                            name="room_ids"
                            options={options.rooms}
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

export function GroupUpdate({ group }: { group: UserGroup }) {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">编辑</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>编辑分组</DialogTitle>
                </DialogHeader>
                <Form
                    action={route('settings.groups.update', group.id)}
                    method="PUT"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <TextField name="name" label="名称" defaultValue={group.name} />
                        <MutiSelectField
                            label="授权直播间"
                            name="room_ids"
                            options={options.rooms}
                            optionsKey={{ label: 'name', value: 'id' }}
                            defaultValue={group.rooms?.map((r) => r.id)}
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
