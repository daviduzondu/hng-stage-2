import Joi from "joi";

export const registerUser = {
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phone: Joi.string()
    })
}

export const loginUser = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}

export const getUser = {
    headers: Joi.object().keys({
        authorization: Joi.string().required().regex(/^Bearer [A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    }).unknown(),
    params: Joi.object().keys({
        id: Joi.string().required().min(4)
    })
}
