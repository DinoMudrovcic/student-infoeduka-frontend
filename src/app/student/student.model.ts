export class Student {

    constructor(
        public username: string,
        private _type: string,
        private _token: string
    ) {}

    get type() {
        return this._type;
    }

    get token() {
        return this._token;
    }


}