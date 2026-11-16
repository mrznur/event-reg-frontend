type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function SlideIn({ children, delay = 0, className = "" }: Props) {
  return (
    <span
      className={`slide-in block ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}
