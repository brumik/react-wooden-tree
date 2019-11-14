export function defVal<T>(variable: T, defaultValue: T): T {
    return typeof variable !== 'undefined' ? variable : defaultValue;
}
