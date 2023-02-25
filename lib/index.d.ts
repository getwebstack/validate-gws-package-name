declare module "@getwebstack/validate-gws-package-name" {
    export function validate(name: string): {isValid: boolean, errors: string[]};
    export function isValidVersionFormat(version: string): boolean;
    export function isNewerVersion(oldVersion: string, newVersion: string): boolean;
}
