import models from '../models/index.js';
import fetch from 'node-fetch';
import * as constants from '../config/constants.js';
const {
    NODE_ENV
} = process.env;

const UserModel = models.UserModel;

export async function create(req, res) {
    try {
        const params = req.params;
        const body = req.body;

        const user = await findUserById(params.id);
        if (!user)
            return res.status(204).json({
                ok: false,
                code: -1,
                message: 'No se econtro ningún usuario con este ID.'
            })

        UserModel.updateOne(
            { id: user.id },
            { $set: body },
            (err, updated) => {
                console.log("OCURRIO UN ERROR AL ACTUALIZAR: ", err);
                console.log("SE ACTUALIZO?", updated);

                res.send("ok")
            }
        )

    } catch (error) {
        res.status(500).json({
            ok: false,
            code: -1,
            message: "Internal server error."
        })
    }
}

export async function findUsers(req, res) {
    try {
        const params = req.params;

        const users_id = (params.ids).split(",");

        const data = [];
        const create_data = [];

        for (const id of users_id) {
            const user = await findUserById(id);
            if (!user) {
                const base_url = NODE_ENV == "development" ? constants.URL_API_DEV : constants.URL_API_PROD;
                const response = await fetch(base_url + id);
                const user_data = await response.json();

                const new_user = { ...user_data.data, ...user_data.support }
                create_data.push(new_user);
            } else {
                data.push({
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                    url: user.url,
                    text: user.text
                });
            }
        }

        if (create_data.length)
            await UserModel.insertMany(create_data);

        res.status(201).json({
            ok: true,
            message: 'Usuario/s econtrados correctamente.',
            code: 0,
            data: [
                ...data,
                ...create_data
            ]
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code: -1,
            message: "Internal server error."
        })
    }
}

async function findUserById(userId) {
    return await new Promise((resolve, reject) => {
        UserModel.find({ id: userId }, (err, user) => {
            if (err) {
                reject(false)
            }

            if (user.length)
                resolve(user[0])
            else
                resolve(null)

        })
    })
}