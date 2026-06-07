import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFormProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const SelectForm: React.FC<SelectFormProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Selecciona una opción',
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-bold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 appearance-none bg-white cursor-pointer ${
          error
            ? 'border-red-500 focus:ring-red-500/50'
            : 'border-gray-200 focus:ring-[#4F6A50]/50'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%234F6A50'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectForm;
