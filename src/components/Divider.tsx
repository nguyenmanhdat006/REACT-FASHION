type DividerProps = {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
};

export function Divider({
  className = '',
  orientation = 'horizontal',
}: DividerProps) {
  const base = 'shrink-0 bg-gray-100';

  const styles =
    orientation === 'horizontal'
      ? 'h-px w-full self-stretch'
      : 'h-full w-px self-stretch';

  return (
    <div
      aria-hidden="true"
      className={`${base} ${styles} ${className}`}
    />
  );
}