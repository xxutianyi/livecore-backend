import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { FormFieldMutiSelect } from '@/components/winglab/form';
import { LiveRoom, User } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function RoomIndex({ user, rooms }: { user: User; rooms: LiveRoom[] }) {
    const columns = defineColumns<LiveRoom>([
        {
            dataKey: 'name',
            title: '名称',
            sortable: true,
        },
        {
            dataKey: 'description',
            title: '简介',
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

    return <SimpleTable data={rooms} columns={columns} />;
}

export function RoomUpdate({ user, rooms }: { user: User; rooms: LiveRoom[] }) {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>修改授权</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>授权直播间</DialogHeader>
                <Form
                    action={route('admin.settings.users.directable', user.id)}
                    method="PUT"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <FormFieldMutiSelect
                            name="room_ids"
                            options={options.rooms}
                            optionsKey={{ label: 'name', value: 'id' }}
                            defaultValue={rooms.map((room) => room.id)}
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
