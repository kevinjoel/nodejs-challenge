import {
    UserModel
} from '../models/index.js';
import fetch from 'node-fetch';
import * as constants from '../config/constants.js';

const {
    NODE_ENV
} = process.env;

/**
 * @class UserController
 * @description Class controller for methods available to a user
 * @param req?: Object - The request
 * @param res?: Object - The response
 */
class UserController {

    /**
     * @method updateUser
     * @desc Update user data by ID and return message
     * @param {*} id 
     * @returns {JSON} response
     */
    async updateUser(req, res) {
        try {
            //Get id user from a params on request
            const params = req.params;
            //Get data to replace in user 
            const body = req.body;

            //Call method from model to update user data 
            UserModel.updateOne(
                { id: params.id }, //Query to search user by id
                { $set: body }, //Data to update user
                (err, updated) => {
                    if (err)
                        return res.status(500).json({
                            message: 'Internal server error.'
                        })

                    if (!updated.matchedCount)
                        //If user not found return an error
                        return res.status(404).json({
                            message: 'Not found user.'
                        })

                    //If the user exists, the data is updated if the data is the same, return the same message 
                    res.status(200).json({
                        message: 'User data succeessfully updated.'
                    })
                }
            )

        } catch (error) {
            //If error ocurren when try to update data print log error an return a error on request
            console.log("updatedUser ERROR: ", error);
            res.status(500).json({
                message: "Internal server error."
            })
        }
    }

    /**
     * @method
     * @desc Find a user or users by ID return a array of users
     * @method findUser
     * @param ids: Number - ID or IDS of user to find in databases.
     * @param sort_by: String Optional* - Base value to sort data results.
     * @param order: String Optional- The sense of order (ASC or DESC)
     * @returns {JSON} response
     */
    async findUser(req, res) {
        try {
            //Get id or ids from a params on request
            const params = req.params;
            //Get a JSON of the received query params Ej. request: url_api_rest?test=test
            const query_params = req.query;

            const data = [], create_data = [];

            //Format the ids to obtain a array
            const users_id = (params.ids).split("&")[0].split(",");
            //Validate the every idi received is a number
            const exist_string = users_id.some(id => isNaN(id));

            if (exist_string)
                //If some ID is a string return a error
                return res.status(500).json({
                    message: "Invalid param request ID user not a number"
                })

            //Clean the repetead elements and perform a recode to array
            for (const id of [...new Set(users_id)]) {

                //Search this user with current ID
                const user = await findUserById(id);
                if (user.error && user.code != "NOT_FOUND")
                    return res.status(500).json({
                        message: "Internal server error."
                    })

                if (!user.error) {
                    //If exist push this on new array to repsonse
                    data.push({
                        id: user.data.id,
                        email: user.data.email,
                        first_name: user.data.first_name,
                        last_name: user.data.last_name,
                        avatar: user.data.avatar,
                        url: user.data.url,
                        text: user.data.text
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
                        return res.status(500).json({
                            message: "Error on will fetch user data."
                        })
                    }
                }
            }

            if (create_data.length) {
                //If array to new users has a element
                //Use a funcion to insert all element in DB collection
                await UserModel.insertMany(create_data);
            }

            console.log(query_params)
            if (query_params.sort_by) {
                //If in the query params get sort by search if exist
                const find_sort_key = data.findIndex(e => e?.[query_params.sort_by])
                if (find_sort_key != -1) {

                    const order_by = query_params.order ? (query_params.order).toUpperCase() : null;
                    if (query_params.order && (order_by != "ASC" && order_by != "DESC"))
                        return res.status(500).json({
                            message: `Error order method ${order_by} not found.`
                        })

                    //ORDER TYPE ASC OR DESC
                    const order = order_by == "ASC" ? 1 : -1;

                    //SORT TYPE IF THIS A NUMBER OR STRING
                    const sort_type = a => ((query_params.sort_by).toLowerCase() == "id" ? parseInt(a[query_params.sort_by]) : a[query_params.sort_by].toUpperCase());

                    //ORDERED COMPLET FUNCION
                    data.sort((a, b) => {
                        a = sort_type(a)
                        b = sort_type(b)
                        return order * ((a > b) - (b > a));
                    })
                } else {
                    console.log(`SORT BY ERROR: ${query_params.sort_by} NOT FOUND key IN COLLECTION`)
                    return res.status(500).json({
                        message: `Error ${query_params.sort_by} not found key in collection.`
                    })
                }
            }

            if (data.length)
                return res.status(200).json({
                    message: 'User found successfully.',
                    data
                })

            res.status(404).json({
                message: 'Not found user.',
            })
        } catch (error) {
            //If error ocurren when try to update data print log error an return a error on request
            console.log("findUser ERROR: ", error);
            res.status(500).json({
                message: "Internal server error."
            })
        }
    }

    /**
     * @method
     * @desc Delete user by ID
     * @method deleteUser
     * @param ids: Number - ID or IDS of user to find in databases.
     * @returns {JSON} response
     */
    async deleteUser(req, res) {
        try {
            //Get a id user to params
            const params = req.params;

            //Call method from model to delete user 
            UserModel.deleteOne(
                { id: params.id }, //Query to search user by id
                (err, deleted) => {
                    if (err)
                        return res.status(500).json({
                            message: "Internal server error."
                        })

                    if (!deleted.deletedCount)
                        //If user not found return an error
                        return res.status(404).json({
                            message: "Not found user with this ID."
                        })

                    res.status(200).json({
                        message: "User succeessfully deleted."
                    })
                })
        } catch (error) {
            //If error ocurren when try to update data print log error an return a error on request
            console.log("deleteUser ERROR: ", error);
            res.status(500).json({
                message: "Internal server error."
            })
        }
    }
}

/**
 * @method
 * @desc Find user by ID
 * @param {*} userId 
 * @returns {JSON} user
 * @throws {REQUEST_ERROR} Internal error when try find user 
 * @throws {NOT_FOUND} User not found in collection
 */
async function findUserById(userId) {
    return await new Promise((resolve, reject) => {
        UserModel.find({ id: userId }, (err, user) => {
            if (err) {
                console.log("findUserById ERROR: ", err);
                return reject({ error: true, code: "REQUEST_ERROR" })
            }

            if (user?.length)
                resolve({ error: false, data: user[0] })
            else
                resolve({ error: true, code: "NOT_FOUND" })

        })
    })
}

export default UserController;