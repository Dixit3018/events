import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private secretKey = 'oiehfgo2ed';

  constructor() {}

//To encrypt input data
public encrypt(password: string): string {
  return CryptoJS.AES.encrypt(password, this.secretKey).toString();
}

//To decrypt input data
public decrypt(passwordToDecrypt: string) {
  return CryptoJS.AES.decrypt(passwordToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
}
}
