const anagramController = {};
import db from '../models/index';
const logger = require('../utils/logger');
import {client} from '../utils/redisInstance';



anagramController.get = async (req, res) => {
    var key = req.params.key;
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if(key){
        if(format.test(key)){
            res.sendStatus(400)
            return;
        }else{
            key = key.split('').sort().join("")   
        }
    }else{
        res.sendStatus(400)
        return;
    }


    try{
        var redisAnagrams = await client.hgetallAsync(key)
        

        if(redisAnagrams){
            if (redisAnagrams.anagrams.length != 0){
                redisAnagrams = redisAnagrams.anagrams.split(",")
            }else{
                redisAnagrams = []
            }
            logger.logResponse(req.id, { word: req.params.key,
                anagrams}, 200);
            res.json({
                word: req.params.key,
                anagrams: redisAnagrams
            })
            return;
        }


        var anagram = await db.Anagrams.findOne({key});
        if(anagram){
            var anagrams = anagram.anagrams
            const indexOfKey = anagram.anagrams.indexOf(req.params.key)
            anagrams.splice(indexOfKey, 1);
    
            await client.hmsetAsync(key, {anagrams})
            logger.logResponse(req.id, { word: req.params.key,
                anagrams}, 200);
            
            res.json({
                word: req.params.key,
                anagrams
            })
        }else{
            await client.hmsetAsync(key, {anagrams: []})
            logger.logResponse(req.id, { word: req.params.key,
                anagrams}, 200);
            
            res.json({
                word: req.params.key,
                anagrams: []
            })
        }
      
    }catch(err){
        console.log(err)
       res.sendStatus(500)
    }

};
export default anagramController;