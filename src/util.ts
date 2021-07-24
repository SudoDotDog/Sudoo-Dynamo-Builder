/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Util
 */

export const joinAndConditions = (conditions: string[]): string => {

    return conditions.map((each) => {
        if (typeof each === 'string') {
            return each.trim();
        }
        return each;
    }).join(' AND ');
};

export const joinOrConditions = (conditions: string[]): string => {

    return conditions.map((each) => {
        if (typeof each === 'string') {
            return each.trim();
        }
        return each;
    }).join(' OR ');
};

export const onlyUseValidObjectProperties = <T extends Record<string, any>>(target: T): T => {

    const keys: string[] = Object.keys(target);

    return keys.reduce((previous: T, key: string) => {

        if (target[key] === undefined) {
            return previous;
        }

        return {
            ...previous,
            [key]: target[key]
        };
    }, {} as T);
};
