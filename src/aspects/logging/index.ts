/* istanbul ignore file */
import * as winston from 'winston';
import * as config from 'config';
import { TransformableInfo } from 'logform';

interface LogConfiguration {
    logLevel: string;
}
const logConfiguration: LogConfiguration = config.get('general');
/*
 *
 * Log levels are:
 *   error: 0 - Any error which is fatal to the operation, but not the service *   or application (can't open a required file, missing data, etc.). These
 *   errors will force user (administrator, or direct user) intervention. *  *   These are usually reserved (in my apps) for incorrect connection strings, *   missing services, etc.,
 *
 *   warn: 1 - Anything that can potentially cause application oddities, but *  *   for which I am automatically recovering. (Such as switching from a primary *   to backup server, retrying an operation, missing secondary data, etc.),
 *
 *   info: 2- Generally useful information to log (service start/stop, *    *   *   configuration assumptions, etc). Info I want to always have available but *   usually don't care about under normal circumstances. This is my
 *   out-of-the-box config level,
 *
 *   verbose: 3,
 *
 *   debug: 4  - Information that is diagnostically helpful to people more than *   just developers (IT, sysadmins, etc.),
 *
 *   trace: 5  - Only when I would be "tracing" the code and trying to find one *   part of a function specifically
 *
 */
export class Logger {
    private _logger: winston.Logger;

    constructor() {
        let logLevel: string = 'error';
        try {
            logLevel = logConfiguration.logLevel;
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.warn(
                'Log Level configuration not found. Using default: ' + logLevel
            );
        }

        this._logger = winston.createLogger({
            level: Logger.mapLogLevels(logLevel),
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => Logger.mapLogMessage(info))
            ),
            transports: [new winston.transports.Console()]
        });
    }

    static mapLogMessage(info: TransformableInfo): string {
        let logMsg = `${info.timestamp} ${info.level} ${info.message}`;
        logMsg =
            info.meta !== undefined
                ? logMsg +
                  ' ' +
                  (typeof info.meta === 'object'
                      ? JSON.stringify(info.meta)
                      : info.meta)
                : logMsg;

        return logMsg;
    }

    static mapLogLevels(level: string): string {
        switch (level) {
            case 'trace':
                return 'silly';
            case 'info':
                return level;
            case 'error':
                return level;
            case 'verbose':
                return level;
            case 'warn':
                return level;
            case 'silly':
                return level;
            case 'debug':
                return level;
            default:
                return 'info';
        }
    }

    /**
     * Maps config file log levels to Morgan output strings
     *
     * combined:
     * :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
     *
     * dev:
     * :method :url :status :response-time ms - :res[content-length]
     *
     * @param level
     */
    static mapLevelToMorganFormat(level: string): string {
        switch (level) {
            case 'trace':
                return 'dev';
            case 'info':
                return 'combined';
            case 'error':
                return 'combined';
            case 'verbose':
                return 'dev';
            case 'warn':
                return 'combined';
            case 'silly':
                return 'dev';
            case 'debug':
                return 'dev';
            default:
                return 'combined';
        }
    }

    // tslint:disable-next-line
    error(msg: string, meta?: any) {
        this._logger.log('error', msg, { meta: meta });
    }

    // tslint:disable-next-line
    warn(msg: string, meta?: any) {
        this._logger.log('warn', msg, { meta: meta });
    }

    // tslint:disable-next-line
    info(msg: string, meta?: any) {
        this._logger.log('info', msg, { meta: meta });
    }

    // tslint:disable-next-line
    verbose(msg: string, meta?: any) {
        this._logger.log('verbose', msg, { meta: meta });
    }

    // tslint:disable-next-line
    debug(msg: string, meta?: any) {
        this._logger.log('debug', msg, { meta: meta });
    }

    // tslint:disable-next-line
    trace(msg: string, meta?: any) {
        this._logger.log('silly', msg, { meta: meta });
    }
}

const logger = new Logger();

export { logger };
