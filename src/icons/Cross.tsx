export default function PaperPlane({
    fill = "currentColor",
    size = 24,
    className = "",
}: {
    fill?: string;
    size?: number;
    className?: string;
}) {
    return (
        <svg
            className={className}
            fill={fill}
            height={size}
            width={size}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M19 5L4.99998 19M5.00001 5L19 19"
                    stroke={fill}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </g>
        </svg>
    );
}

