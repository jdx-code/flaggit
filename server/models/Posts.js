const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    post_desc: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
});

const postModel = mongoose.model('posts', PostSchema);
module.exports = postModel