export default function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim().length === 0)
    );
}
