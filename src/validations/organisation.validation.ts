import Joi from "joi"

export const createOrganisation = {
    header: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string()
    })
}

export const getOrganisations = {
    header: Joi.object().keys({
        Authorization: Joi.string().required()
    })
}

export const getOrganisation = {
    header: Joi.object().keys({
        Authorization: Joi.string().required()
    }),
    params: {
        orgId: Joi.string().required()
    }
}

export const addUserToOrg = {
    ...getOrganisation,
    body: {
        userId: Joi.string().required()
    }
}
