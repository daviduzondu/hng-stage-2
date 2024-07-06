import Joi from "joi"

export const createOrganisation = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string()
    })
}

export const getOrganisation = {
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
