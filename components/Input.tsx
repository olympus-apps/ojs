type InputProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
};

export default function Input({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  placeholder,
}: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-800 focus:ring-2"
      />
    </label>
  );
}
