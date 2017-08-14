import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'crypto-pro';
import * as cryptoprotest from 'crypto-pro/src/apiAsync';

interface cadesplugin {
    CreateObjectAsync<T>(arg: string): Promise<T>;
}

interface window {
    cadesplugin?: cadesplugin;
}

interface Certificates {
    Certificate: Promise<Certificate>;
    Item(arg: number): Certificate;
}

interface Store {
    Certificates: Promise<Certificates>;
    Open(): void;
}

interface Signer {
    Certificate: Promise<Certificate>;
    propset_Certificate(arg: Certificate): Certificate;
}

interface SignedData {
    propset_Content(str: string): Promise<string>;
    SignCades(sin: Signer, arg: number): Promise<string>;
}

window.setTimeout(() => {
    window['cryptoprotest'] = cryptoprotest;
}, 3000);

export default class CryptoCSP {

    Store: Store;
    plugin: cadesplugin;
    Certificate: Certificate;
    Signer: Signer;
    signedData: SignedData;

    constructor() {
        let windowObject: window = (window as window);
        if ( windowObject.cadesplugin !== undefined) {
            this.plugin = windowObject.cadesplugin;
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            this.initStore().then(() => {
                this.initSigner().then(() => {
                   resolve();
                });
            }).catch(() => {
               reject();
            });
        });
    }

    initStore() {
        return new Promise((resolve, reject) => {
            this.plugin.CreateObjectAsync('CADESCOM.Store').then((store: Store) => {
                this.Store = store;
                return this.Store.Open();
            }).then(() => {
                return this.Store.Certificates.then((cert: Certificates) => {
                    return cert.Item(1);
                });
            }).then((certificate: Certificate) => {
                this.Certificate = certificate;
                resolve();
            });
        });
    }

    initSigner() {
        return new Promise((resolve) => {
            this.plugin.CreateObjectAsync('CADESCOM.CPSigner').then((signer: Signer) => {
                signer.propset_Certificate(this.Certificate);
                this.Signer = signer;
                resolve();
            });
        });
    }

    signByStr(str: string) {
        return this.plugin.CreateObjectAsync('CADESCOM.CadesSignedData').then((signedData: SignedData) => {
            signedData.propset_Content(str);
            return signedData.SignCades(this.Signer, 1);
        });
    }
}

window['CryptoCSP'] = CryptoCSP;

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
