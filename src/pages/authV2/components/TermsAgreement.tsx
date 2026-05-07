interface TermsAgreementProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function TermsAgreement({ checked, onCheckedChange }: TermsAgreementProps) {
  return (
    <label className="flex items-start gap-3 self-stretch cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <span className="text-sm leading-6 text-black/80">
        I accept the Term of Use and Privacy Policy.
      </span>
    </label>
  );
}
