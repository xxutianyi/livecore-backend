import { PageContent, Section, SectionTitle } from '@/components/container';
import { PasswordField, TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { WebsiteLayout } from '@/layouts/website-layout';
import { cn } from '@/lib/utils';
import { SharedProps } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { Lock, User } from 'lucide-react';
import { ComponentProps, ReactNode, useState } from 'react';
import { toast } from 'sonner';

export function UpdateProfile({ action }: { action: ReactNode }) {
  const { auth } = usePage<SharedProps>().props;

  return (
    <Section title={<SectionTitle title="基本信息" actions={[action]} />}>
      <Separator />
      <Form
        action={route('profile.update')}
        method="PUT"
        onSuccess={() => {
          toast.success('更新成功');
        }}
      >
        <FieldGroup>
          <TextField name="name" label="名字" defaultValue={auth.user?.name} />
          <TextField name="phone" label="手机号" defaultValue={auth.user?.phone} />
          <TextField name="email" label="电子邮箱" defaultValue={auth.user?.email} />
          <Field>
            <Button type="submit">更新</Button>
          </Field>
        </FieldGroup>
      </Form>
    </Section>
  );
}

export function UpdatePassword({ action }: { action: ReactNode }) {
  return (
    <Section title={<SectionTitle title="修改密码" actions={[action]} />}>
      <Separator />
      <Form
        action={route('password.update')}
        method="PUT"
        onSuccess={() => {
          toast.success('更新成功');
        }}
      >
        <FieldGroup>
          <PasswordField name="current_password" label="当前密码" />
          <PasswordField name="password" label="新密码" />
          <PasswordField name="password_confirmation" label="再次输入新密码" />
          <Field>
            <Button type="submit">更新</Button>
          </Field>
        </FieldGroup>
      </Form>
    </Section>
  );
}

export default function Profile() {
  const [section, setSection] = useState<'account' | 'password'>('account');

  const AccountButton = (props: ComponentProps<typeof Button>) => (
    <Button
      variant="secondary"
      className="md:hidden"
      onClick={() => setSection('account')}
      {...props}
    >
      <User /> 基本信息
    </Button>
  );
  const PasswordButton = (props: ComponentProps<typeof Button>) => (
    <Button
      variant="secondary"
      className="md:hidden"
      onClick={() => setSection('password')}
      {...props}
    >
      <Lock /> 修改密码
    </Button>
  );
  return (
    <WebsiteLayout>
      <PageContent title="账号设置">
        <Separator />
        <div className="mx-auto flex w-full max-w-5xl space-x-12">
          <nav className="hidden w-full max-w-1/5 flex-col space-y-1 md:flex">
            <AccountButton
              size="lg"
              variant="ghost"
              className={cn(
                'justify-start',
                section === 'account'
                  ? 'bg-muted hover:bg-accent'
                  : 'hover:bg-accent hover:underline',
              )}
            />
            <PasswordButton
              size="lg"
              variant="ghost"
              className={cn(
                'justify-start',
                section === 'password'
                  ? 'bg-muted hover:bg-accent'
                  : 'hover:bg-accent hover:underline',
              )}
            />
          </nav>
          <div className="w-full">
            {section === 'account' && <UpdateProfile action={<PasswordButton key="account" />} />}
            {section === 'password' && <UpdatePassword action={<AccountButton key="password" />} />}
          </div>
        </div>
      </PageContent>
    </WebsiteLayout>
  );
}
