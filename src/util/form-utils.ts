import type { ValidationError } from "yup";

export const buildErrors = (errors: Map<string, string>, err: ValidationError) => {
    let newErrors = errors;
    err.inner.forEach((error) => {
        if (error.path && !errors.has(error.path)) {
            newErrors = newErrors.set(error.path, error.message);
        }
    });
    return newErrors;
};
