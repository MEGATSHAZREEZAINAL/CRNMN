import React from 'react';
import type { ReactNode } from 'react';

// Common props for icons, e.g., to allow passing className
interface IconProps {
  className?: string;
}

export const InstagramIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8s.01 2.444.048 3.297c.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.445.01 10.173 0 8 0zm0 1.442c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.598.92c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.92c-.11-.28-.24-.705-.276-1.485C1.442 10.445 1.434 10.173 1.434 8s.008-2.389.047-3.232c.036-.78.166-1.204.276-1.486a2.5 2.5 0 0 1 .598-.92c.28-.28.546.453.92-.598.282-.11.705-.24 1.485-.276.843-.039 1.096-.047 3.233-.047zM8 4.202c-2.09 0-3.798 1.708-3.798 3.798s1.708 3.798 3.798 3.798 3.798-1.708 3.798-3.798S10.09 4.202 8 4.202zm0 6.153c-1.305 0-2.355-1.05-2.355-2.355S6.695 5.645 8 5.645s2.355 1.05 2.355 2.355-1.05 2.355-2.355 2.355zm4.965-6.417a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92z" />
  </svg>
);

export const TikTokIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3zM3 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
  </svg>
);

export const TwitterIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75zm-.86 13.028h1.36L4.323 2.145H2.865z" />
  </svg>
);

export const ScheduleIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
  </svg>
);

export const PublishedIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
  </svg>
);

export const BrainIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M9.5 0a.5.5 0 0 0-.5.5v.616a3.5 3.5 0 0 0-1.743.812c-.226.13-.44.279-.642.443-.118.096-.23.203-.335.318a.5.5 0 0 0 .85.533c.1-.11.208-.21.312-.298.207-.168.423-.32.652-.468C8.674 2.1 9 1.733 9 1.5V1h.5a.5.5 0 0 0 .5-.5M4.5 1a.5.5 0 0 0-.5.5v.452c0 .356.112.69.313.975.201.286.45.53.727.727.276.198.58.337.896.413a.5.5 0 1 0 .341-.94c-.255-.072-.5-.18-.727-.323-.228-.142-.424-.32-.587-.525C4.088 2.548 4 2.228 4 1.952V1.5a.5.5 0 0 0-.5-.5m.354 1.854a.5.5 0 1 0-.708-.708.5.5 0 0 0 .708.708m-1.005 5.21a.5.5 0 0 0 .5.5h.003l.002-.005a.5.5 0 0 0-.505-.495M11.5 1a.5.5 0 0 0-.5.5v.452c0 .356-.112.69-.313.975-.201.286-.45.53-.727.727-.276.198-.58.337-.896.413a.5.5 0 1 0 .341-.94c.255-.072.5-.18.727-.323.228-.142.424-.32.587-.525C11.912 2.548 12 2.228 12 1.952V1.5a.5.5 0 0 0-.5-.5m-1.646 1.854a.5.5 0 1 0-.708-.708.5.5 0 0 0 .708.708M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M7.5 12a.5.5 0 0 0 .5.5h.003l.002-.005a.5.5 0 0 0-.505-.495" />
    <path d="M12.5 10.5a.5.5 0 0 0-.5.5v.452c0 .356.112.69.313.975.201.286.45.53.727.727.276.198.58.337.896.413a.5.5 0 1 0 .341-.94c-.255-.072-.5-.18-.727-.323-.228-.142.424-.32-.587-.525C12.088 12.548 12 12.228 12 11.952V11.5a.5.5 0 0 0-.5-.5m-9 0a.5.5 0 0 0-.5.5v.452c0 .356.112.69.313.975.201.286.45.53.727.727.276.198.58.337.896.413a.5.5 0 1 0 .341-.94c-.255-.072-.5-.18-.727-.323-.228-.142.424-.32-.587-.525C4.088 12.548 4 12.228 4 11.952V11.5a.5.5 0 0 0-.5-.5m5.5 4.5a.5.5 0 0 0-.5.5v.616a3.5 3.5 0 0 0-1.743.812c-.226.13-.44.279-.642.443-.118.096-.23.203-.335.318a.5.5 0 1 0 .85.533c.1-.11.208-.21.312-.298.207-.168.423-.32.652-.468C8.674 18.1 9 17.733 9 17.5V17h.5a.5.5 0 0 0 .5-.5z" />
  </svg>
);

export const DocumentTextIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

export const UsersIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M12 12a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm-3.375-1.5a1.125 1.125 0 0 1 2.25 0v.003a1.125 1.125 0 0 1-2.25 0v-.003Z"
    />
  </svg>
);

export const GlobeAltIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c.24 0 .468.02.69.058M12 21c-.24 0-.468.02-.69.058m1.38 0-1.38.01m-1.38 0-1.38-.01M3.282 14.252a9.016 9.016 0 0 1-2.433-2.433m16.866 2.433a9.016 9.016 0 0 0-2.433-2.433M3.282 14.252l1.106 3.19M17.618 14.252l-1.106 3.19m-3.3-1.018a3.375 3.375 0 0 1-3.375-3.375c0-1.864 1.51-3.375 3.375-3.375s3.375 1.511 3.375 3.375c0 .324-.047.641-.132.94M3.282 14.252a9 9 0 0 1 1.056-4.938"
    />
  </svg>
);

export const ChartPieIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
    />
  </svg>
);

export const QrCodeIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 4.875c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3.75 9.375v-4.5zM3.75 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5zM13.5 4.875c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 15.375a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM14.625 15.375a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25zM15.75 15.375a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM16.875 15.375a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25zM18 15.375a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM13.5 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25zM14.625 16.5a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM15.75 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25zM16.875 16.5a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM18 16.5a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25zM13.5 17.625a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM14.625 17.625a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25zM15.75 17.625a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM16.875 17.625a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25zM18 17.625a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM13.5 18.75a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25zM14.625 18.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM15.75 18.75a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25zM16.875 18.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0zM18 18.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0z"
    />
  </svg>
);

export const CheckCircleIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const XCircleIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const CurrencyDollarIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11s-1.536.21-2.121.621c-1.172.879-1.172 2.303 0 3.182z"
    />
  </svg>
);

export const ArrowTrendingUpIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 18 9-9 4.5 4.5L21.75 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h6v6" />
  </svg>
);

export const WifiIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.111 16.556A5.5 5.5 0 0112 15c1.425 0 2.756.52 3.889 1.556m-7.778 0a9 9 0 0115.556 0m-7.778 0l-.01.01m.01-.01a12.5 12.5 0 0112.5 0"
    />
  </svg>
);

export const BatteryIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 01.553-.894L9 4m0 16v-16m0 16h6a1 1 0 001-1v-1.5a1 1 0 00-1-1h-6a1 1 0 00-1 1V19a1 1 0 001 1zm-6-16h6a1 1 0 011 1v1.5a1 1 0 01-1 1h-6a1 1 0 01-1-1V5a1 1 0 011-1z"
    />
  </svg>
);

export const XIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export const FacebookIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
  </svg>
);

export const YouTubeIcon = ({ className }: IconProps): ReactNode => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className={className}
    viewBox="0 0 16 16"
  >
    <path d="M8.051 1.999a.6.6 0 0 1 .59.022l4.987 2.5a.6.6 0 0 1 .324.532v5.91a.6.6 0 0 1-.324.532l-4.987 2.5a.6.6 0 0 1-.59.022l-4.987-2.5a.6.6 0 0 1-.324-.532v-5.91a.6.6 0 0 1 .324-.532l4.987-2.5.001-.002zM6.3 9.405a.4.4 0 0 0 .6.346l3.2-2a.4.4 0 0 0 0-.692l-3.2-2a.4.4 0 0 0-.6.346v4z" />
  </svg>
);
