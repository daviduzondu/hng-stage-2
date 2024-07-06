import { pick } from "../utils/pick.js"

export default class Model {
    pick(predicate: any) {
        return pick(this, predicate);
    }
};