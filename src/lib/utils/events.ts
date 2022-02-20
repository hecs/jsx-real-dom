export function createEventChange(type, options: EventInit = { bubbles: true }) {
    return (detail: any) => (e: Event) => {
        const evt = new CustomEvent(type, { ...options, detail });
        if (e.target) {
            e.target.dispatchEvent(evt);
        }
    };
}

export const createEvent = (type, detail?: any, options: EventInit = { bubbles: true }) =>
    new CustomEvent(type, { ...options, detail });
