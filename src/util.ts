/**
 * @author WMXPY
 * @namespace Dynamo_Builder
 * @description Util
 */

export const convertToStringObject = (target: any): string => {

    if (typeof target === 'string') {
        return target;
    }

    if (target instanceof Date) {
        return target.toISOString();
    }

    if (Boolean(target.toString)) {
        return target.toString();
    }

    return String(target);
};

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
