import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn, csrfToken } from '@/lib/utils';
import { useFormContext } from '@inertiajs/react';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Check, ChevronsUpDown, Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

export type FieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: string;
};

export type SelectProps = FieldProps & {
  options: Record<string, any>[];
  optionsKey?: { label: string; value: string };
};

export type MutiSelectProps = Omit<SelectProps, 'defaultValue'> & {
  defaultValue?: string[];
  options: Record<string, any>[];
  optionsKey?: { label: string; value: string };
};

export type UploadProps = Omit<FieldProps, 'placeholder' | 'defaultValue'> & {
  accept?: string[];
};

export function TextField({ name, label, placeholder, defaultValue }: FieldProps) {
  const form = useFormContext();

  if (!form) {
    return null;
  }

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        placeholder={placeholder ?? '请输入'}
        defaultValue={defaultValue}
        type="text"
      />
      {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
    </Field>
  );
}

export function PasswordField({ name, label, description, defaultValue, placeholder }: FieldProps) {
  const form = useFormContext();
  const [visible, setVisible] = useState(false);

  if (!form) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <InputGroup>
        <Input
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder ?? '请输入'}
          type={visible ? 'text' : 'password'}
          data-slot="input-group-control"
          className="border-none bg-transparent focus-visible:ring-0"
        />
        <InputGroupAddon align="inline-end">
          <Button variant="ghost" size="icon-sm" onClick={() => setVisible(!visible)}>
            {visible ? <Eye /> : <EyeClosed />}
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
    </Field>
  );
}

export function TextareaField({ name, label, placeholder, description, defaultValue }: FieldProps) {
  const form = useFormContext();
  if (!form) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Textarea
        id={name}
        name={name}
        placeholder={placeholder ?? '请输入'}
        defaultValue={defaultValue}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
    </Field>
  );
}

export function SelectField({
  name,
  label,
  placeholder,
  description,
  defaultValue,
  options,
  optionsKey,
}: SelectProps) {
  optionsKey = optionsKey ?? { value: 'value', label: 'label' };

  const form = useFormContext();
  const [value, setValue] = useState<string>(defaultValue ?? '');

  if (!form) return null;

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

      {description && <FieldDescription>{description}</FieldDescription>}
      {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
    </Field>
  );
}

export function MutiSelectField({
  name,
  label,
  placeholder,
  description,
  defaultValue,
  options,
  optionsKey,
}: MutiSelectProps) {
  optionsKey = optionsKey ?? { value: 'value', label: 'label' };

  const form = useFormContext();
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue ?? []);

  if (!form) return null;

  const selectedItems = options.filter((option) =>
    selectedValues.includes(option[optionsKey.value]),
  );

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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-auto min-h-10 w-full justify-between bg-input/50! px-3 py-2"
          >
            <div className="flex flex-wrap gap-2 overflow-hidden">
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <Badge key={index}>{item[optionsKey.label]}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder ?? '请选择'}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          onWheel={(e) => e.stopPropagation()}
          className="w-(--radix-popover-trigger-width) p-0"
        >
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

      {description && <FieldDescription>{description}</FieldDescription>}
      {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
    </Field>
  );
}

export function UploadField({ name, label, accept, description }: UploadProps) {
  const form = useFormContext();

  registerPlugin(FilePondPluginImagePreview);
  registerPlugin(FilePondPluginFileValidateType);

  if (!form) return null;
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <FilePond
        id={name}
        name={name}
        chunkUploads
        credits={false}
        acceptedFileTypes={accept}
        server={{
          url: '/api/filepond',
          headers: { 'X-CSRF-TOKEN': csrfToken() },
        }}
        labelIdle='拖拽文件到此处或<span class="filepond--label-action">浏览文件</span>'
        labelInvalidField="文件校验失败"
        labelFileWaitingForSize="检测文件大小"
        labelFileSizeNotAvailable="文件大小检测失败"
        labelFileLoading="加载中"
        labelFileLoadError="加载失败"
        labelFileProcessing="上传中"
        labelFileProcessingComplete="上传完成"
        labelFileProcessingAborted="上传中断"
        labelFileProcessingError="上传失败"
        labelFileProcessingRevertError="恢复失败"
        labelFileRemoveError="移除失败"
        labelTapToCancel="点击取消"
        labelTapToRetry="点击重试"
        labelTapToUndo="点击撤销"
        labelButtonRemoveItem="移除"
        labelButtonAbortItemLoad="中断"
        labelButtonRetryItemLoad="重试"
        labelButtonAbortItemProcessing="取消"
        labelButtonUndoItemProcessing="撤销"
        labelButtonRetryItemProcessing="重试"
        labelButtonProcessItem="上传"
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {form.errors[name] && <FieldError errors={[{ message: form.errors[name] }]} />}
    </Field>
  );
}
