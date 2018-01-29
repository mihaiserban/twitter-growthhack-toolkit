var T = require('./index'),
  utils = require('./utils'),
  notifier = require('node-notifier'),
  argv = require('minimist')(process.argv.slice(2)),
  followList,
  whitelistedWords;

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

var statusStream = T.stream('statuses/filter', {
  follow: followList
});

//https://tweeterid.com

statusStream.on('tweet', function(tweet) {
  if (followList.indexOf(tweet.user.id) > -1 && !tweet.retweeted_status) {
    console.log('@' + tweet.user.screen_name + ' tweeted.');
    console.log(tweet.text);
    var lowercaseTweet = tweet.text.toLowerCase();
    if (
      lowercaseTweet.indexOf('social') === -1 &&
      lowercaseTweet.indexOf('market') === -1 &&
      lowercaseTweet.indexOf('brand') === -1 &&
      lowercaseTweet.indexOf('onboard') === -1 &&
      lowercaseTweet.indexOf('lead') === -1 &&
      lowercaseTweet.indexOf('seo') === -1 &&
      lowercaseTweet.indexOf('sell') === -1 &&
      lowercaseTweet.indexOf('content') === -1 &&
      lowercaseTweet.indexOf('analytics') === -1 &&
      lowercaseTweet.indexOf('growth') === -1 &&
      lowercaseTweet.indexOf('startup') === -1 &&
      lowercaseTweet.indexOf('entrepreneur') === -1 &&
      lowercaseTweet.indexOf('blog') === -1 &&
      lowercaseTweet.indexOf('tech') === -1 &&
      lowercaseTweet.indexOf('javascript') === -1 &&
      lowercaseTweet.indexOf('deep learning') === -1 &&
      lowercaseTweet.indexOf('artificial intelligence') === -1 &&
      lowercaseTweet.indexOf('machine learning') === -1 &&
      lowercaseTweet.indexOf('startup') === -1 &&
      lowercaseTweet.indexOf('code') === -1 &&
      lowercaseTweet.indexOf('security') === -1 &&
      lowercaseTweet.indexOf('nodejs') === -1 &&
      lowercaseTweet.indexOf('ios') === -1 &&
      lowercaseTweet.indexOf('swift') === -1 &&
      lowercaseTweet.indexOf('android') === -1 &&
      lowercaseTweet.indexOf('java') === -1 &&
      lowercaseTweet.indexOf('apple') === -1 &&
      lowercaseTweet.indexOf('uber') === -1 &&
      lowercaseTweet.indexOf('google') === -1 &&
      lowercaseTweet.indexOf('nvidia') === -1 &&
      lowercaseTweet.indexOf('microsoft') === -1 &&
      lowercaseTweet.indexOf('facebook') === -1 &&
      lowercaseTweet.indexOf('crypto') === -1 &&
      lowercaseTweet.indexOf('bitcoin') === -1 &&
      lowercaseTweet.indexOf('ethereum') === -1 &&
      lowercaseTweet.indexOf('litecoin') === -1 &&
      lowercaseTweet.indexOf('blockchain') === -1 &&
      lowercaseTweet.indexOf('Elon') === -1 &&
      lowercaseTweet.indexOf('Musk') === -1 &&
      lowercaseTweet.indexOf('leadership') === -1 &&
      lowercaseTweet.indexOf('vision') === -1 &&
      tweet.user.id !== 2246032237 && //iamjtsuccess
      tweet.user.id !== 25458378 //AskAaronLee
    ) {
      console.log('No status update. Did not pass sanity check.')
      console.log('-----');
      return;
    }
    T.post('statuses/update', {
      status: tweet.text
    }, function(err, data, response) {
      if (err) {
        console.log('Error updating status')
        console.log('-----');
        return;
      }
      notifier.notify({
        'title': '@' + tweet.user.screen_name + ' tweeted.',
        'message': tweet.text
      });
      console.log('Status updated successfully. ' + new Date())
      console.log('-----');
    });
  }
});
