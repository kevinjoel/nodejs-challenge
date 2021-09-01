import models from '../models/index.js';
import fetch from 'node-fetch';
import * as constants from '../config/constants.js';

const {
    NODE_ENV
} = process.env;

const UserModel = models.UserModel;

/**
 * A class UserController
 * @class UserController
 * @param req?: Object - The request
 * @param res?: Object - The response
 */
class UserController {
    async updateUser(req, res) {
        try {
            const params = req.params;
            const body = req.body;

            UserModel.updateOne(
                { id: params.id },
                { $set: body },
                (err, updated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            code: -1,
                            message: 'Internal server error.'
                        })
                    }

                    if (updated.matchedCount)
                        res.status(200).json({
                            ok: true,
                            code: 0,
                            message: 'Usuario actualizado correctamente.'
                        })
                    else
                        res.status(404).json({
                            ok: false,
                            code: 1,
                            message: 'No se contro nigún usuario para actualizar.'
                        }) 
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

    /**
        Find a user or users by ID return a array of users.
        # API
        ```
        @method findUser
        @param ids: Number - ID or IDS of user to find in databases.
        @param sort_by: String Optional* - Base value to sort data results.
        @param order: String Optional- The sense of order (ASC or DESC)
        ```
        # Examples
        ```
        UserController.findUser(req, res);
        ```
    */
    async findUser(req, res) {
        try {
            const params = req.params; //Get a JSON of the received params 
            const query_params = req.query; //Get a JSON of the received query params Ej. request: url_api_rest?test=test

            const data = [], create_data = [];

            //Format the ids to obtain a array
            const users_id = (params.ids).split(",");

            //Clean the repetead elements and perform a recode to array
            for (const id of [...new Set(users_id)]) {

                //Search this user with current ID
                const user = await findUserById(id);
                if (user) {
                    //If exist push this on new array to repsonse
                    data.push({
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        avatar: user.avatar,
                        url: user.url,
                        text: user.text
                    });
                } else {
                    //If not exist get new user data to registered in DB collection
                    const base_url = NODE_ENV == "development" ? constants.URL_API_DEV : constants.URL_API_PROD;

                    //Create new request to external API to get random user data
                    const response = await fetch(base_url + id);

                    if (response.status == 200) {
                        //If request is succeded push this data on new array to save in DB collection
                        const user_data = await response.json();

                        const new_user = { ...user_data.data, ...user_data.support }
                        create_data.push(new_user);
                    } else {
                        //If not request print on log the status of response
                        console.log("FETCH RESPONSE FAIL: ", response.status)
                    }
                }
            }

            if (create_data.length) {
                //If array to new users has a element
                //Use a funcion to insert all element in DB collection
                await UserModel.insertMany(create_data);
            }

            if (query_params.sort_by) {
                //If in the query params get sort by search if exist
                const find_sort_key = data.findIndex(e => e?.[query_params.sort_by])
                if (find_sort_key != -1) {

                    //ORDER TYPE ASC OR DESC
                    const order = query_params.order == "ASC" ? 1 : -1;

                    //SORT TYPE IF THIS A NUMBER OR STRING
                    const sort_type = a => ((query_params.sort_by).toLowerCase() == "id" ? parseInt(a[query_params.sort_by]) : a[query_params.sort_by].toUpperCase());

                    //ORDERED COMPLET FUNCION
                    data.sort((a, b) => {
                        a = sort_type(a)
                        b = sort_type(b)
                        return order * ((a > b) - (b > a));
                    })
                } else {
                    console.log(`SORT BY ERROR: ${query_params.sort_by} NO EXISTE EN LOS KEY PARA BUSCAR`)
                }
            }

            res.status(201).json({
                ok: true,
                message: 'Usuario/s econtrado/s correctamente.',
                code: 0,
                data
            })
        } catch (error) {
            console.log("API FINDUSER ERROR: ", error);
            res.status(500).json({
                ok: false,
                code: -1,
                message: "Internal server error."
            })
        }
    }

    async deleteUser(req, res) {
        try {
            const params = req.params;

            UserModel.deleteOne({ id: params.id }, (err, deleted) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        code: -1,
                        message: "Internal server error."
                    })

                if (deleted.deletedCount)
                    res.status(200).json({
                        ok: true,
                        code: 0,
                        message: "Usuario eliminado correctamente."
                    })
                else
                    res.status(404).json({
                        ok: false,
                        code: 0,
                        message: "No existe nigun usuario con este ID para eliminar."
                    })
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
}

async function findUserById(userId) {
    return await new Promise((resolve, reject) => {
        UserModel.find({ id: userId }, (err, user) => {
            if (err) {
                reject(false)
            }

            // console.log("USER", user);
            if (user.length)
                resolve(user[0])
            else
                resolve(null)

        })
    })
}

export default UserController;