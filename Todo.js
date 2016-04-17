var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  completedAt: Date
});

module.exports = mongoose.model('Todo', todoSchema);
