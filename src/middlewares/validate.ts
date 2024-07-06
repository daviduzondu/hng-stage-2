import { Request, Response, NextFunction } from 'express';
import { pick } from '../utils/pick.js';
import Joi, { string } from 'joi';

function formatErrorMessage(originalMessage: string, field: string | number): string {
    return originalMessage.split(" ").map((x, i) => {
        if (x.endsWith("\"")) {
            return field.toString();
        } else {
            return x;
        }
    }).join(" ");
}

const validate = (schema: Record<string, any>) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['header', 'params', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema).validate(object, { abortEarly: false });

    if (error) {
        const validationErrors = error.details.map(x => ({
            field: x.path.reverse()[0],
            message: formatErrorMessage(x.message, x.path[0])
        }));
        return res.status(422).json({
            errors: validationErrors
        })
    }

    return next();
}

export default validate;