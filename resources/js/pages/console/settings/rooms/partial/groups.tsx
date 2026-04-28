import { Section } from '@/components/container';
import { MutiSelectField } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { LiveRoom, UserGroup } from '@/services/model';
import { SharedProps } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { ColumnsDef, Table } from '@winglab/inertia-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function GroupIndex({ room }: { room: LiveRoom }) {
  const columns = ColumnsDef<UserGroup>([
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
      index: 'action',
      tableRowRender: (data) => (
        <Button asChild variant="secondary">
          <Link href={route('settings.users.index') + `?groups=${data.id}`}>用户</Link>
        </Button>
      ),
    },
  ]);

  return (
    <Section title="授权用户组">
      <Table data={room.groups} columns={columns} />
    </Section>
  );
}

export function GroupUpdate({ room }: { room: LiveRoom }) {
  const [open, setOpen] = useState(false);

  const { options } = usePage<SharedProps>().props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>修改授权</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>授权用户组</DialogTitle>
        </DialogHeader>
        <Form
          action={route('settings.rooms.groups', room.id)}
          method="PUT"
          onSuccess={() => {
            setOpen(false);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <MutiSelectField
              name="group_ids"
              options={options.groups}
              optionsKey={{ label: 'name', value: 'id' }}
              defaultValue={room.groups?.map((g) => g.id)}
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
