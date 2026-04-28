import { TextareaField, TextField } from '@/components/form';
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
import { Client } from '@/services/model';
import { Form, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ClientCreate() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新建凭证</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建凭证</DialogTitle>
        </DialogHeader>
        <Form
          action={route('systems.clients.store')}
          method="POST"
          onSuccess={() => {
            setOpen(false);
            toast.success('保存成功');
          }}
        >
          <FieldGroup>
            <TextField name="name" label="凭证名称" />
            <TextareaField
              name="whitelist"
              label="IP白名单"
              description="多个IP地址请用英文逗号分隔"
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

export function ClientDelete({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);

  function handleDelete() {
    router.delete(route('systems.clients.destroy', client.id));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">删除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除凭证</DialogTitle>
          <DialogDescription>
            删除后使用该凭证的客户端将立即无法访问接口，且无法恢复
          </DialogDescription>
        </DialogHeader>
        <Button variant="destructive" onClick={handleDelete}>
          确定删除
        </Button>
      </DialogContent>
    </Dialog>
  );
}
