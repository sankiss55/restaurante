import React from 'react';

interface InputFormProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  min?: string;
}

const InputForm: React.FC<InputFormProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  multiline = false,
  rows = 4,
  disabled = false,
  min = undefined,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 font-sans resize-none ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-red-500/50'
              : 'border-gray-200 focus:ring-[#4F6A50]/50'
          }`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-red-500/50'
              : 'border-gray-200 focus:ring-[#4F6A50]/50'
          }`}
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputForm;
