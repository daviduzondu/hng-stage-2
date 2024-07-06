import Joi from "joi"

export const createOrganisation = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string()
    })
}

export const getOrganisations = {
    headers: Joi.object().keys({
        authorization: Joi.string().required()
    }).unknown()
}

export const getOrganisation = {
    headers: Joi.object().keys({
        authorization: Joi.string().required()
    }).unknown(),
    params: {
        orgId: Joi.string().required()
    }
}

export const addUserToOrg = {
    params: {
        orgId: Joi.string().required()
    },
    body: {
        userId: Joi.string().required()
    }
}
