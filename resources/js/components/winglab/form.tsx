import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFormContext } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export type BaseFieldProps = {
    name: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
};

export type SelectProps = BaseFieldProps & {
    options: Record<string, any>[];
    optionsKey?: { label: string; value: string };
};

export type MutiSelectProps = Omit<BaseFieldProps, 'defaultValue'> & {
    defaultValue?: string[];
    options: Record<string, any>[];
    optionsKey?: { label: string; value: string };
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

export function FormFieldTextarea({ name, label, placeholder, defaultValue }: BaseFieldProps) {
    const form = useFormContext();

    if (!form) {
        return null;
    }

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Textarea id={name} name={name} placeholder={placeholder ?? '请输入'} defaultValue={defaultValue} />
            {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
        </Field>
    );
}

export function FormFieldSelect({
    name,
    label,
    placeholder,
    defaultValue,
    options,
    optionsKey = { value: 'value', label: 'label' },
}: SelectProps) {
    const form = useFormContext();
    const [value, setValue] = useState<string>(defaultValue ?? '');

    if (!form) {
        return null;
    }

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <input name={name} value={value} readOnly className="hidden" />

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

export function FormFieldMutiSelect({
    name,
    label,
    placeholder,
    defaultValue,
    options,
    optionsKey = { value: 'value', label: 'label' },
}: MutiSelectProps) {
    const form = useFormContext();
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue ?? []);

    if (!form) {
        return null;
    }

    const selectedItems = options.filter((option) => selectedValues.includes(option[optionsKey.value]));

    function handleSelect(newValue: string) {
        if (selectedValues.includes(newValue)) {
            setSelectedValues(selectedValues.filter((value) => value !== newValue));
        } else {
            setSelectedValues([...selectedValues, newValue]);
        }
    }

    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            {selectedValues.map((value, index) => (
                <input key={index} name={`${name}[]`} value={value} readOnly className="hidden" />
            ))}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="h-auto min-h-10 w-full justify-between bg-muted px-3 py-2">
                        <div className="flex flex-wrap gap-2 overflow-hidden">
                            {selectedItems.length > 0 ? (
                                selectedItems.map((item, index) => <Badge key={index}>{item[optionsKey.label]}</Badge>)
                            ) : (
                                <span className="text-muted-foreground">{placeholder ?? '请选择'}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Command>
                        <CommandInput placeholder="搜索..." />
                        <CommandList>
                            <CommandEmpty>没有找到匹配项</CommandEmpty>
                            <CommandGroup>
                                {options.map((option, index) => (
                                    <CommandItem
                                        key={index}
                                        value={option[optionsKey.label]}
                                        onSelect={() => handleSelect(option[optionsKey.value])}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedValues.includes(option[optionsKey.value])
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {option[optionsKey.label]}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
        </Field>
    );
}
