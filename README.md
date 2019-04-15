# anagramBackend
Part of anagram challenge. 

[![Build Status](https://travis-ci.org/rajatonit/anagram-backend.svg?branch=master)](https://travis-ci.org/rajatonit/anagram-backend)

# Run server
npm run dev  (requires MONGO_URI and REDIS_URL as env variables)

# Build 
npm run transpile

# Interacting with the Local API
```{bash}
# Health
$ curl -i -X GET http://localhost:8081/health
HTTP/1.1 200 OK
...
# API endpoint
$ curl -i -X GET http://localhost:8081/api/v1
HTTP/1.1 200 OK
...
{
    "message":"Welcome to the anagram API!"
}
# Fetching an anagram
$ curl -i -X GET http://localhost:8081/api/v1/anagram/:anagram
### ex: http://localhost:8081/api/v1/anagram/bats
HTTP/1.1 200 OK
{
    "word":"bats",
    "anagrams":["bast","bats","stab"]
}
### ex: http://localhost:8081/api/v1/anagram/sdasdsasdas
HTTP/1.1 200 OK
{
    "word":"sdasdsasdas",
    "anagrams":[]
}
### ex: http://localhost:8081/api/v1/anagram/dsdsds@#$
HTTP/1.1 400 Bad Request
```