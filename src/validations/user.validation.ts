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
    header: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}
