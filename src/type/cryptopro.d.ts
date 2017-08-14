declare module 'crypto-pro' {
    export default function call(...args: Array<string>): any;
}

interface NativeCertificate {

}

interface Certificate {
    issuerName: string;
    label: string;
    name: string;
    subjectName: string;
    thumbprint: string;
    validFrom: string;
    validTo: string;
    _cert: NativeCertificate;
}

declare module 'crypto-pro/src/apiAsync' {
    export function getCert(hash: string): Promise<Certificate>;
    export function getCertsList(resetCache: boolean): Promise<Array<Certificate>>;
    export function signData(hash: string, dataBase64: string, signType: boolean): Promise<Certificate>;
}