export declare type MapOf<T, K> = T extends string ? Record<T, K> : Record<keyof T, K>;
