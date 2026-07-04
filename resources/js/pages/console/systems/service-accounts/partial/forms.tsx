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
import { Form, router } from '@inertiajs/react';
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

export function ServiceAccountDelete({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    router.delete(route('systems.service-accounts.destroy', user.id), {
      onSuccess: () => {
        setOpen(false);
        toast.success('影子用户已删除');
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">删除影子用户</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除影子用户</DialogTitle>
          <DialogDescription>
            删除后使用该影子用户 ID 的外部 API 调用会立即失效，已授权直播间关系会被解除，且无法恢复。
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm">
          <div className="font-medium text-destructive">请确认你正在删除：</div>
          <div className="mt-2 grid gap-1">
            <div>名称：{user.name}</div>
            <div className="break-all font-mono text-xs">ID：{user.id}</div>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          确认删除，外部接口将失效
        </Button>
      </DialogContent>
    </Dialog>
  );
}
