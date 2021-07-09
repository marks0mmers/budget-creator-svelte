import { get, writable } from "svelte/store";
import type { ValidationError } from "yup";

const buildErrors = (errors: Map<string, string>, err: ValidationError) => {
    let newErrors = errors;
    err.inner.forEach(error => {
        if (error.path && !errors.has(error.path)) {
            newErrors = newErrors.set(error.path, error.message);
        }
    });
    return newErrors;
};

export const useForm = <T>(initialValues: T, schema: any) => {
    let submitted = writable(false);
    let errors = writable(new Map<string, string>());

    const form = writable<T>(initialValues);

    form.subscribe(() => {
        submitted.set(false);
        errors.set(new Map<string, string>());
    });

    submitted.subscribe(s => {
        if (s) {
            schema.validate(get(form), { abortEarly: false }).catch((err: ValidationError) => {
                errors.set(buildErrors(get(errors), err));
            });
        }
    });

    const onSubmit = (f: () => Promise<void>) => async () => {
        submitted.set(true);
        const isValid = await schema.validate(get(form));
        if (isValid) {
            await f();
        }
    };

    return {
        errors,
        form,
        onSubmit,
    };
};
