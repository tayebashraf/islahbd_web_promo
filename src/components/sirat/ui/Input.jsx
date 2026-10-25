import React, { forwardRef } from 'react';
import './input.css';

export const FormField = ({ label, required, error, hint, children, className = '', id }) => {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="form-label__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="form-control-wrapper">{children}</div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
};

export const Input = forwardRef(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const inputElement = (
      <input
        ref={ref}
        id={id}
        className={`form-input ${error ? 'form-control--error' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
    );

    if (label || error || hint) {
      return (
        <FormField label={label} required={required} error={error} hint={hint} id={id}>
          {inputElement}
        </FormField>
      );
    }

    return inputElement;
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const textareaElement = (
      <textarea
        ref={ref}
        id={id}
        className={`form-textarea ${error ? 'form-control--error' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
    );

    if (label || error || hint) {
      return (
        <FormField label={label} required={required} error={error} hint={hint} id={id}>
          {textareaElement}
        </FormField>
      );
    }

    return textareaElement;
  }
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef(
  ({ label, error, hint, required, options = [], children, className = '', id, ...props }, ref) => {
    const selectElement = (
      <select
        ref={ref}
        id={id}
        className={`form-select ${error ? 'form-control--error' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
    );

    if (label || error || hint) {
      return (
        <FormField label={label} required={required} error={error} hint={hint} id={id}>
          {selectElement}
        </FormField>
      );
    }

    return selectElement;
  }
);
Select.displayName = 'Select';

export default Input;
