from pymongo import MongoClient
import os
import sys
import multiprocessing
anagram_dict = {}
client = ''

def init_words(fileName):
    words = {}
    with open(fileName) as f:
        for line in f:
            word = line.strip()
            words[word] = ''
    return words


def init_anagram_dict(words):
    anagram_dict = {}
    for word in words:
        sorted_word = ''.join(sorted(list(word)))
        if sorted_word not in anagram_dict: 
            anagram_dict[sorted_word]=[]
        anagram_dict[sorted_word].append(word)
    return anagram_dict


def find_anagrams(word,anagram_dict):
    key= ''.join(sorted(list(word)))
    if key in anagram_dict:
        return set(anagram_dict[key]).difference(set([word]))
    return set([])

def anagrams_to_db(skip_n,limit_n):
    print('Starting process',skip_n//limit_n,'...')
    print (skip_n, ' ', limit_n)
    db = client['anagram']
    anagram_dict_keys = list(anagram_dict.keys())
    anagrams = db.anagrams
    for i in range(limit_n):
        # print(skip_n)
        if i+skip_n -1 < 0 :
            key = anagram_dict_keys[i+skip_n]
        else:
            key = anagram_dict_keys[i+skip_n -1]
        anagram = {"key": key,"anagrams":  anagram_dict[key]}
        anagrams.insert_one(anagram)


if __name__ == '__main__':
    client = MongoClient(os.environ['MONGO_URI'])
    n_cores = 4              
    filname = 'dict.txt'
    word_dict = init_words(filname)
    anagram_dict = init_anagram_dict(word_dict.keys())
    #110339 
    print(len(anagram_dict.keys()))
    collection_size = len(anagram_dict.keys())
    batch_size = round(collection_size/n_cores+0.5)
    skips = range(0, n_cores*batch_size, batch_size)

    processes = [ multiprocessing.Process(target=anagrams_to_db, args=(skip_n,batch_size)) for skip_n in skips]

    for process in processes:
        process.start()

    for process in processes:
        process.join()



