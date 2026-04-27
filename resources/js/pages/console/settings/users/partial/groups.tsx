import { MutiSelectField, TextField } from '@/components/form';
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
import { UserGroup } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, router, usePage } from '@inertiajs/react';
import { ColumnsDef, Table } from '@winglab/inertia-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function GroupIndex() {
  const { options } = usePage<SharedProps>().props;

  const columns = ColumnsDef<UserGroup>([
    {
      dataKey: 'name',
      title: '名字',
    },
    {
      index: 'actions',
      tableRowRender: (data) => {
        return (
          <div className="max-w-12">
            <GroupUpdate group={data} />
            <GroupDelete group={data} />
          </div>
        );
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
        <Table columns={columns} data={options.groups as UserGroup[]} />
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

export function GroupDelete({ group }: { group: UserGroup }) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    router.delete(route('settings.groups.destroy', group.id), {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">删除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除分组</DialogTitle>
          <DialogDescription>删除后将解除与用户和直播间的关联，且无法恢复</DialogDescription>
        </DialogHeader>
        <Button variant="destructive" onClick={handleDelete}>
          确定删除
        </Button>
      </DialogContent>
    </Dialog>
  );
}
