import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useFormContext } from '@inertiajs/react';

export type BaseFieldProps = {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
};

export function FormFieldText({ name, label, placeholder, defaultValue }: BaseFieldProps) {
    const form = useFormContext();

    if (!form) {
        return null;
    }

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input id={name} name={name} placeholder={placeholder ?? '请输入'} defaultValue={defaultValue} />
            {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
        </Field>
    );
}
