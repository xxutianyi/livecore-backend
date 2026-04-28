import { SelectField, TextField } from '@/components/form';
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
        <DialogHeader>
          <DialogTitle>新建用户</DialogTitle>
          <DialogDescription>默认密码 Password!@ ，请提示用户修改</DialogDescription>
        </DialogHeader>
        <Form
          action={route('systems.users.store')}
          method="POST"
          onSuccess={() => {
            setOpen(false);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="姓名" />
            <TextField name="phone" label="手机号" />
            <TextField name="email" label="电子邮件" />
            <SelectField
              name="role"
              label="用户角色"
              options={[
                { label: '系统管理员', value: 'admin' },
                { label: '直播管理员', value: 'room-admin' },
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
  const { auth } = usePage<SharedProps>().props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>编辑用户</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>编辑用户</DialogHeader>
        <Form
          action={route('systems.users.update', user.id)}
          method="PUT"
          onSuccess={() => {
            setOpen(false);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="姓名" defaultValue={user.name} />
            <TextField name="phone" label="手机号" defaultValue={user.phone} />
            <TextField name="email" label="电子邮件" defaultValue={user.email} />
            <SelectField
              name="role"
              label="用户角色"
              defaultValue={user.role}
              disabled={auth.user?.id === user.id}
              options={[
                { label: '系统管理员', value: 'admin' },
                { label: '直播管理员', value: 'room-admin' },
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
