import { Table } from "drizzle-orm";

export interface IBaseRepository<T> {
    create(item: T): Promise<T | null>;
    update(item: T, hasUpdateAt: boolean): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    find(id: string): Promise<T | null>;
    findAll(item: T): Promise<T[]>;
}