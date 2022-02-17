export function useTranslations(input) {
    return (key: TemplateStringsArray | string, props?: any) => {
        let values = input;
        if (typeof input === "function") {
            values = input();
        }
        if (Array.isArray(key)) {
            key = key[0];
        }

        const value = values && values[key as string];

        if (!value) return key;
        if (!props) return value;
        return value.replace(/\{\{(.+)\}\}/gi, (s, prop) => {
            const r = props[prop.trim()];
            return r === undefined ? s : r;
        });
    };
}
