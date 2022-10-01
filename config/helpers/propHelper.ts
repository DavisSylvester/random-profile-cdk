export class PropRecordHelper<T, R> {

    public extractRecordValues(data: Record<string, R>) {
        const result: R[] = [];
        
        for (const [key, value] of Object.entries(data as Record<string, R>)) {           

            result.push(value as R);            
        }

        return result as R[];
    }
}
