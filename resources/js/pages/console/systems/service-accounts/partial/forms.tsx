import { TextField } from '@/components/form';
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
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ServiceAccountCreate() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新建影子用户</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建影子用户</DialogTitle>
          <DialogDescription>影子用户用于外部接口扮演授权角色，不用于人工登录。</DialogDescription>
        </DialogHeader>
        <Form
          action={route('systems.service-accounts.store')}
          method="POST"
          onSuccess={() => {
            setOpen(false);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="名称" />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceAccountUpdate({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>编辑影子用户</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑影子用户</DialogTitle>
        </DialogHeader>
        <Form
          action={route('systems.service-accounts.update', user.id)}
          method="PUT"
          onSuccess={() => {
            setOpen(false);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="名称" defaultValue={user.name} />
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
