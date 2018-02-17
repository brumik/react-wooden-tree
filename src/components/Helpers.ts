export function defVal<T>(variable: T, defaultValue: T): T {
    return variable != null ? variable : defaultValue;
}