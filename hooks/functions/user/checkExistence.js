import { ALREADY_EXISTS } from "../../../libs/errors.js";
export const checkExistenceUser = (app) => async (request, reply) => {
    const users = app.mongo.db.collection('register');

    let user = request.body;

    let result = await products.count({name: user.name});

    if(result > 0) throw new ALREADY_EXISTS();
}