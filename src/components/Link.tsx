export default function Link({
    href,
    children,
}: {
    href: string;
    children?: JSX.Element | JSX.Element[] | string;
}) {
    return (
        <a
            className='underline text-blue-600 visited:text-blue-800'
            href={href}
            target='_blank'
        >
            {children}
        </a>
    );
}
