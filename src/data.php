<?php
// Defining a constant to store as a key on redis
define('KEY_PATTERN', 'coordinate:');

// Getting the coordinate variable through post
$coordinate = $_POST['coordinate'] ?? null;
// Getting the cache clear variable through get
$clear      = $_GET['clear'] ?? null;
// Connecting to redis
$redis      = connect();

// If clear is set, remove all keys from redis
if ($clear) {
    $redis->flushAll();
}

// If coordinate is set, use the KEY_PATTERN to store the coordinate result
// ex: coordinate:20170808120000
if ($coordinate) {
    $redis->set(KEY_PATTERN . time(), $coordinate);
}

// Initiliazing an empty response array
$response = [];
// grab all redis keys based on pattern
// ex: coordinate:*
$keys     = $redis->keys(KEY_PATTERN . "*");

// Traverse through all redis keys
foreach ($keys as $key) {
    // Fetch each key value and store in the array
    $response[] = $redis->get($key);
}

// Defining the HTTP header for content-type JSON
header('content-type: application/json');
//Defining HTTP headers to prevent browser's cache
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0');
header('Pragma: no-cache');

// JSON encode the array and print
echo json_encode($response);

/**
 * A function to create a redis object
 */
function connect()
{
    // Instantiate the Redis object
    $redis    = new \Redis();
    // Grab the password from the environment variable
    $password = getenv('REDI_PASSWORD');
    
    // Connect to redis using environment variables for HOST/SERVER and PORT
    $redis->connect(getenv('REDIS_HOST'), getenv('REDIS_PORT'));

    // If a password is set, let's authenticate to redis
    if ($password) {
        $redis->auth($password);
    }

    // Set the default serializer of redis
    // By default, let's use PHP's serialization so we don't need to convert JSON back and forth from Redis
    $redis->setOption(Redis::OPT_SERIALIZER, Redis::SERIALIZER_PHP);
    
    // Returns our new redis connection object
    return $redis;
}