import mongoose from 'mongoose';

await mongoose.connect('mongodb+srv://jonnykim:1nbEtP63PsxAD8of@cluster0.y9ymbqv.mongodb.net/?retryWrites=true&w=majority');
console.log("successfully connected to mongodb");

const userSchema = new mongoose.Schema({
  url: String,
  description: String,
  created_date: Date
});

models.User = mongoose.model('User', userSchema);

console.log('mongoose models created');

export default models;