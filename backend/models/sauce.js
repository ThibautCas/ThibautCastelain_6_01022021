const mongoose = require('mongoose');
const { stringify } = require('querystring');

const thingSchema = mongoose.Schema({
  userId: { type: String},
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  mainPepper: { type: String, required: true},
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true},
  likes: {type: Number, default: 0},
  dislikes: { type: Number, default: 0},
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]},
});

module.exports = mongoose.model('Thing', thingSchema);