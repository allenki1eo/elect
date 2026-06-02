interface Props {
  className?: string;
  size?: number;
}
export default function Logo({ className, size = 48 }: Props) {
  return (
    <img
      src="/logo.png"
      alt="IEBC wa MCHONGO"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'inline-block', minWidth: size, minHeight: size }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
