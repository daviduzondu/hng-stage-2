import { Router } from "express";
import * as organisationValidations from '../validations/organisation.validation.js';
import validate from "../middlewares/validate.js";
import { addUserToOrg, createOrganisation, getOrganisation, getOrganisations } from "../controllers/organisation.controller.js";
import { authorize } from "../middlewares/auth.js";

const organisationRouter = Router();

organisationRouter.route('/')
    .get(validate(organisationValidations.getOrganisations), authorize, getOrganisations)
    .post(validate(organisationValidations.createOrganisation), authorize, createOrganisation);

organisationRouter.route("/:orgId").get(validate(organisationValidations.getOrganisation), authorize, getOrganisation);

organisationRouter.route("/:orgId/users").post(validate(organisationValidations.addUserToOrg), addUserToOrg);

export default organisationRouter