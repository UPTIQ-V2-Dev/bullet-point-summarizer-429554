import { password } from "./custom.validation.js";
import Joi from 'joi';
const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
        role: Joi.string().required().valid('USER', 'ADMIN')
    })
};
const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
};
const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom((value, helpers) => {
            const parsed = parseInt(value);
            if (isNaN(parsed)) {
                return helpers.error('any.invalid');
            }
            return parsed;
        })
    })
};
const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom((value, helpers) => {
            const parsed = parseInt(value);
            if (isNaN(parsed)) {
                return helpers.error('any.invalid');
            }
            return parsed;
        })
    }),
    body: Joi.object()
        .keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        name: Joi.string()
    })
        .min(1)
};
const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom((value, helpers) => {
            const parsed = parseInt(value);
            if (isNaN(parsed)) {
                return helpers.error('any.invalid');
            }
            return parsed;
        })
    })
};
export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
