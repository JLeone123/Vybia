import winston from "winston";

const filterError = winston.format((info, opts) => {
    return info.level === "error" ? info : false;
});

const filterHttp = winston.format((info, opts) => {
    return info.level === "http" ? info : false;
});

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ 
            filename: "app.log",
            level: 'info',
            format: winston.format.combine(
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({
            filename: 'app-errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.simple(),
                filterError(),
            ),
        }),
        new winston.transports.File({
            filename: 'app-http.log',
            level: 'http',
            format: winston.format.combine(
                winston.format.simple(),
                filterHttp(),
            )
        }),
    ],
});