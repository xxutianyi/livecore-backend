import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from '@inertiajs/react';
import { useState } from 'react';

export type BaseFieldProps = {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
};

export type SelectFieldProps = BaseFieldProps & {
    options: Record<string, any>[];
    optionsKey: { label: string; value: string };
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

export function FormFieldSelect({ name, label, placeholder, defaultValue, options, optionsKey }: SelectFieldProps) {
    const form = useFormContext();
    const [value, setValue] = useState<string>();

    if (!form) {
        return null;
    }

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <input name={name} value={value} className="hidden" />
            <Select defaultValue={defaultValue} onValueChange={setValue}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder ?? '请选择'} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((option, index) => (
                            <SelectItem key={index} value={option[optionsKey.value]}>
                                {option[optionsKey.label]}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
        </Field>
    );
}
