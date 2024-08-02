export const extractIdGraphQL = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
};

export const fileDate = (): string => {
    const date = new Date();
    const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
    const month = date.toLocaleDateString('en-GB', { month: '2-digit' });
    const year = date.toLocaleDateString('en-GB', { year: 'numeric' });

    return `${year}${month}${day}`;
};
