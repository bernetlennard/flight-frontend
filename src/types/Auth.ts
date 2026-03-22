// src/types/Auth.ts
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}