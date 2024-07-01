import { Table } from "drizzle-orm";

export interface IBaseRepository<T> {
    create(item: T): Promise<T | null>;
    update<TA extends Table>(table: TA,
        updateFields: Partial<TA['$inferInsert']>,
        whereConditions: Partial<TA['$inferInsert']>): Promise<T[] | null>
    delete(id: string): Promise<boolean>;
    find(id: string): Promise<T | null>;
    findAll(item: T): Promise<T[]>;
}