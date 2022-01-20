class InternalError extends Error {
    constructor(public message: string, protected code: number = 500, protected description?: string) {
        super(message);
        //Evita que a classe seja demonstrada durante o throw do error e mostra o local onde o erro foi chamado
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }


}


export default InternalError;