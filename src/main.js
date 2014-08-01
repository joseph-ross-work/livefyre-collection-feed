var auth = require('auth');

auth.on('login', function () {
    console.log('auth login', arguments);
})

exports.ActivityFeed = require('./activity-feed');
exports.activityToContent = require('./activity-to-content');
exports.Activities = require('./activities');
exports.PersonalizedActivities = require('./personalized-activities');
