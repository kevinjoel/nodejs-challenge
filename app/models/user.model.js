import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema(
    {
        id: { type: 'number' },
        email: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        company: { type: 'string' },
        avatar: { type: 'string' },
        url: { type: 'string' },
        text: { type: 'string' }
    },
    {
        collection: "Users"
    }
)

export default mongoose.model('Users', User);