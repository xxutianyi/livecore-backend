import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { FormFieldMutiSelect } from '@/components/winglab/form';
import { LiveRoom, UserGroup } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function GroupIndex({ groups }: { groups: UserGroup[] }) {
    const columns = defineColumns<UserGroup>([
        {
            dataKey: 'name',
            title: '名称',
            sortable: true,
        },
        {
            dataKey: 'users_count',
            title: '用户数',
            sortable: true,
        },
        {
            index: 'actions',
            tableRowRender: (data) => {
                return (
                    <Button asChild variant="secondary">
                        <Link href={route('admin.live.rooms.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return <SimpleTable data={groups} columns={columns} />;
}

export function GroupUpdate({ room, groups }: { room: LiveRoom; groups: UserGroup[] }) {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>修改授权</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>授权用户组</DialogHeader>
                <Form
                    action={route('admin.live.rooms.groups', room.id)}
                    method="PUT"
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
                            defaultValue={groups.map((g) => g.id)}
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
