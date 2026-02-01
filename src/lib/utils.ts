import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InjectionRule {
    id: string;
    name: string;
    pattern: string;
    script: string;
    active: boolean;
}
