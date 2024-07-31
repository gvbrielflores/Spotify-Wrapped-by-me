import { serialize, parse } from 'cookie';

export async function setCookie(res: any, name: string, value: string, options: any = {}) {
    // If value is an object, stringVal is "j:{value}" else it is {value}
    const stringVal = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    const cookieArray = Array.isArray(res.getHeader('Set-Cookie') || []) ? (res.getHeader('Set-Cookie') || []) : 
    ([res.getHeader('Set-Cookie')]);
    cookieArray.push(serialize(name, String(stringVal), options));

    res.setHeader('Set-Cookie', cookieArray);
} 

export function getCookie(req: any, name: string) {
    const cookies = parse(req.headers.cookie || '');
    return cookies[name] ? cookies[name] : undefined;
}

export function removeCookie(res: any, name: string) {
    setCookie(res, name, '', { maxAge: -1 });
}