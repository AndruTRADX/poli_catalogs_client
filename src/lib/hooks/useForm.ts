import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useForm<T extends z.ZodType>(schema: T) {
  const [values, setValues] = useState<z.infer<T>>({} as z.infer<T>);
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<T>, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof z.infer<T>, boolean>>>({});

  const handleChange = useCallback((name: keyof z.infer<T>, value: z.infer<T>[keyof z.infer<T>]) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    setTouched(prev => ({ ...prev, [name]: true }));
    
    try {
      schema.parse(newValues);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === name);
        if (fieldError) {
          setErrors(prev => ({ ...prev, [name]: fieldError.message }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    }
  }, [schema, values]);

  const handleBlur = useCallback((name: keyof z.infer<T>) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar el campo cuando el usuario sale del input
    try {
      schema.parse(values);
      // Si la validación pasa, limpiar el error de este campo
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === name);
        if (fieldError) {
          setErrors(prev => ({ ...prev, [name]: fieldError.message }));
        } else {
          // Si no hay error para este campo específico, limpiarlo
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    }
  }, [schema, values]);

  const validate = useCallback(() => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof z.infer<T>, string>> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof z.infer<T>;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  const reset = useCallback(() => {
    setValues({} as z.infer<T>);
    setErrors({});
    setTouched({});
  }, []);

  const clearError = useCallback((name: keyof z.infer<T>) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
    clearError,
    clearAllErrors,
  };
} 