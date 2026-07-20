type IconProps = {
  size?: number;
  className?: string;
};

function Icon({ children, size = 24, className, ...rest }: IconProps & { children: React.ReactNode } & Record<string, unknown>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m20 12-8 8-8-8V4h8l8 8Z" />
      <path d="M8.5 8.5h.01" />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4 16 9.5-9.5 4 4L8 20H4v-4Z" />
      <path d="m12.5 7.5 4 4M15 5l4 4" />
    </Icon>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7h11v9H3zM14 10h3.5L21 13.5V16h-7z" />
      <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </Icon>
  );
}

export function StarIcon({ fill, ...rest }: IconProps & { fill?: string }) {
  return (
    <Icon {...rest}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill={fill || "none"} />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </Icon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Icon>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}

export function HeartIcon({ fill, ...rest }: IconProps & { fill?: boolean }) {
  return (
    <Icon {...rest}>
      <path
        d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1Z"
        fill={fill ? "currentColor" : "none"}
      />
    </Icon>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6h15l-2 9H7L5 3H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3 20 6v5.5c0 4.8-3.1 8-8 9.5-4.9-1.5-8-4.7-8-9.5V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2L15.8 9" />
    </Icon>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 21V4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21" />
      <path d="M4 21h16M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
    </Icon>
  );
}

export function CreditCardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6.5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
      <path d="M2 10h20M6 14h5M15 14h3" />
    </Icon>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h8l1 2h2v15H5V6h2l1-2Z" />
      <path d="M9 13.5 11.2 16 16 10.5" />
    </Icon>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" />
    </Icon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 8h-2a2 2 0 0 0-2 2v10M10 12h6" />
    </Icon>
  );
}

export function XLogoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4l6.5 7.5L4 20h2l5.5-6.5L17 20h3l-7-8.5L19 4h-2l-5 6L7 4H4z" />
    </Icon>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M8 11v5M8 8.5v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M12 5v14" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <path d="M4 7h16v5H4z" />
      <path d="M12 7V3M8 3c-1 0-2 .9-2 2s1 2 2 2M16 3c1 0 2 .9 2 2s-1 2-2 2" />
    </Icon>
  );
}

export function ShoppingBagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </Icon>
  );
}

export function DollarSignIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Icon>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </Icon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}
