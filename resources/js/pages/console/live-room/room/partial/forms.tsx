import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { FormFieldText, FormFieldTextarea } from '@/components/winglab/form';
import { LiveRoom } from '@/services/model';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function RoomCreate() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>新建直播间</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>新建直播间</DialogHeader>
                <Form
                    action={route('console.rooms.store')}
                    method="POST"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <FormFieldText name="name" label="名称" />
                        <FormFieldTextarea name="description" label="简介" />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function RoomUpdate({ room }: { room: LiveRoom }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>编辑直播间</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>编辑直播间</DialogHeader>
                <Form
                    action={route('console.rooms.update', room.id)}
                    method="PUT"
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('保存成功');
                    }}
                >
                    <FieldGroup>
                        <FormFieldText name="name" label="名称" defaultValue={room.name} />
                        <FormFieldTextarea name="description" label="简介" defaultValue={room.description} />
                        <Field>
                            <Button type="submit">保存</Button>
                        </Field>
                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
