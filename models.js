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
    created_date: Date
  });

  models.Post = mongoose.model('Post', postSchema);
  
  console.log('mongoose models created');
}

export default models;