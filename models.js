import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main() {
  await mongoose.connect('mongodb+srv://jonnykim:1nbEtP63PsxAD8of@cluster0.y9ymbqv.mongodb.net/?retryWrites=true&w=majority');
  console.log("successfully connected to mongodb");

  const postSchema = new mongoose.Schema({
    url: String,
    username: String,
    description: String,
    created_date: Date,
    likes: [String]
  });

  models.Post = mongoose.model("Post", postSchema);

  const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    created_date: Date
  });

  models.Comment = mongoose.model("Comment", commentSchema);

  const userInfoSchema = new mongoose.Schema({
    username: String,
    favorite_food: String
  });
  
  models.UserInfo = mongoose.model("UserInfo", userInfoSchema);

  console.log('mongoose models created');
}

export default models;