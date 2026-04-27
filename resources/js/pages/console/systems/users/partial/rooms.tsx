import { Section } from '@/components/container';
import { MutiSelectField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup } from '@/components/ui/field';
import { LiveRoom, User } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { ColumnsDef, Table } from '@winglab/inertia-table';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function RoomIndex({ user }: { user: User }) {
    const columns = ColumnsDef<LiveRoom>([
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
                        <Link href={route('settings.rooms.show', data.id)}>详情</Link>
                    </Button>
                );
            },
        },
    ]);

    return (
        <Section title="可管理的直播间">
            {user.role === 'admin' && (
                <Empty className="border">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ShieldCheck />
                        </EmptyMedia>
                        <EmptyTitle>系统管理员</EmptyTitle>
                        <EmptyDescription>该用户可管理全部直播间</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
            {user.role === 'room-admin' && <Table data={user.manageable ?? []} columns={columns} />}
        </Section>
    );
}

export function RoomUpdate({ user }: { user: User }) {
    const [open, setOpen] = useState(false);

    const { options } = usePage<SharedProps>().props;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>修改授权</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>授权直播间</DialogTitle>
                </DialogHeader>
                <Form
                    action={route('systems.users.manageable', user.id)}
                    method="PUT"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <MutiSelectField
                            name="room_ids"
                            options={options.rooms}
                            optionsKey={{ label: 'name', value: 'id' }}
                            defaultValue={user.manageable?.map((room) => room.id)}
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
