export default class ContactLinksGenerator {
    _number = '';
    _message = '';
    _email = '';

    constructor({
        number,email
    }: { number: string, email: string }){
        this._number = number;
        this._email = email;
    }

    get tel(){
        return `tel:${this._number}`;
    }

    get chat() {
        return `sms:${this._number}?body=${this._message}`;
    }

    get mail() {
        return `mailto:${this._email}`;
    }

    get whatsapp() {
        return `https://api.whatsapp.com/send?phone=${this._number}`;
    }

}