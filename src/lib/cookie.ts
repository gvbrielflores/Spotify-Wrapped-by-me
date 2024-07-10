import { serialize, parse } from 'cookie';

export function setCookie(res: any, name: string, value: string, options: any = {}) {
    // if value is an object, stringVal is "j:{value}" else it is {value}
    const stringVal = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    if ('maxAge' in options) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.maxAge /= 1000;
    }

    res.setHeader('Set-Cookie', serialize(name, String(stringVal), options));
} 

export function getCookie(req: any, name: string) {
    const cookies = parse(req.headers.cookie || '');
    return cookies[name] ? cookies[name] : undefined;
}

export function removeCookie(res: any, name: string) {
    setCookie(res, name, '', { maxAge: -1 });
}