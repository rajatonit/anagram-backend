import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.Promise = global.Promise;


const anagramSchema = new Schema({
    key: {
      type: String,
      required: true, 
    },
    anagrams:{
        type: Array,
        required: true
    }
  });

const Anagrams = mongoose.model('anagrams', anagramSchema);
export default Anagrams;