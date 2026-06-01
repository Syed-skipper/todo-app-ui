"use client";

import { Field, Input, NativeSelect, Textarea } from "@chakra-ui/react";
import { inputStyles } from "../../theme/theme";

export function FormInput({ label, name, type = "text", value, onChange, placeholder, required, min, max, step, ...rest }) {
  return (
    <Field.Root required={required}>
      {label && <Field.Label color="var(--ink-muted)">{label}</Field.Label>}
      <Input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        size="lg"
        borderRadius="12px"
        {...inputStyles}
        {...rest}
      />
    </Field.Root>
  );
}

export function FormSelect({ label, name, value, onChange, children, required, placeholder }) {
  return (
    <Field.Root required={required}>
      {label && <Field.Label color="var(--ink-muted)">{label}</Field.Label>}
      <NativeSelect.Root size="lg">
        <NativeSelect.Field
          name={name}
          value={value ?? ""}
          onChange={onChange}
          borderRadius="12px"
          {...inputStyles}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </NativeSelect.Field>
      </NativeSelect.Root>
    </Field.Root>
  );
}

export function FormTextarea({ label, name, value, onChange, rows = 3, ...rest }) {
  return (
    <Field.Root>
      {label && <Field.Label color="var(--ink-muted)">{label}</Field.Label>}
      <Textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        borderRadius="12px"
        {...inputStyles}
        {...rest}
      />
    </Field.Root>
  );
}
