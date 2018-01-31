var T = require('./index')
var utils = require('./utils')
var notifier = require('node-notifier')
var argv = require('minimist')(process.argv.slice(2))

var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
  application_id: process.env.AYLIEN_ID,
  application_key: process.env.AYLIEN_KEY,
});

var followList;
var whitelistedWords;

var tweets = []

var lastTweetDate = new Date()

var minTimeDifferenceSeconds = 1370;
var maxTimeDifferenceSeconds = 1570;

followList = [33057154, //JeffSheehan 
  1605891337, //GrowthHackerAm
  609718712, //GrowthHackingWP
  14894250, //fab_brianson
  2792078121, //m1lem
  18185124, //jeffbullas
  26554000, //RebekahRadice
  2332401396, //loveandstartups
  468290519, //SharonTighe
  409435591, //Onboardly
  233430873, //Notebook
  1705885393, //GrowthHackers
  159642250, //GrowthHacker
  14426771, //SeanEllis
  2604068238, //thepressfarm
  1890842214, //seotomize
  17093617, //hootsuite
  2670122929, //GrowthHackerSEO
  259725229, //ValaAfshar
  25458378, // AskAaronLee
  1344951, //wired
  816653, //techcrunch
  112243365, //mashabletech
  14372486, //engadget
  1333467482, //coindesk
  2207129125, //cointelegraph
  1297100576, //foundr
  10638782, //danmartell
  ]

let keywords = [
  'social',
  'market',
  'brand',
  'onboard',
  'lead',
  'seo',
  'sell',
  'content',
  'analytics',
  'growth',
  'startup',
  'entrepreneur',
  'blog',
  'tech',
  'javascript',
  'deep learning',
  'artificial intelligence',
  'machine learning',
  'startup',
  'code',
  'security',
  'nodejs',
  'ios',
  'swift',
  'android',
  'java',
  'apple',
  'uber',
  'google',
  'nvidia',
  'microsoft',
  'facebook',
  'crypto',
  'bitcoin',
  'ethereum',
  'litecoin',
  'blockchain',
  'Elon',
  'Musk',
  'leadership',
  'vision',
]

function postTweet(tweet) {
  lastTweetDate = new Date(); //update date

  textapi.hashtags({
    text: tweet.text
  }, function(error, response) {
    if (error === null) {
      console.log(response.hashtags);

      var text = tweet.text

      if (response.hashtags.length) {
        text += ' ' + response.hashtags.join(' ');
      }

      T.post('statuses/update', {
        status: text
      }, function(err, data, response) {
        if (err) {
          console.log('Error updating status')
          console.log('-----');
          return;
        }
        notifier.notify({
          'title': '@' + tweet.user.screen_name + ' tweeted.',
          'message': text
        });
        console.log('Status updated successfully. ' + new Date())
        console.log('-----');
      });
    }
  });


}

function containsAny(str, substrings) {
  for (var i = 0; i != substrings.length; i++) {
     var substring = substrings[i];
     if (str.indexOf(substring) != - 1) {
       return substring;
     }
  }
  return null; 
}

var statusStream = T.stream('statuses/filter', {
  follow: followList
});

//https://tweeterid.com

statusStream.on('tweet', function(tweet) {
  if (followList.indexOf(tweet.user.id) > -1 && !tweet.retweeted_status) {
    console.log('@' + tweet.user.screen_name + ' tweeted.');
    console.log(tweet.text);
    var lowercaseTweet = tweet.text.toLowerCase();

    var result = containsAny(lowercaseTweet, keywords);

    if (!result &&
      tweet.user.id !== 2246032237 && //iamjtsuccess
      tweet.user.id !== 25458378 //AskAaronLee
    ) {
      console.log('No status update. Did not pass sanity check.')
      console.log('-----');
      return;
    }

    if (tweets.length < 20) {
      tweets.push(tweet)
    }
  }
});


setInterval(function() {
  console.log('interval called')
  var randomTimeInFuture = Math.floor(Math.random() * maxTimeDifferenceSeconds) + minTimeDifferenceSeconds;
  var currentDate = new Date();

  var difference = (currentDate - lastTweetDate) / 1000;

  console.log(difference + ' needed = ' + randomTimeInFuture)
  if (difference >= randomTimeInFuture && tweets.length > 0) {
    var tweet = tweets.shift();
    postTweet(tweet);
  } 
}, 1000);