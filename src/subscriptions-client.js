var $ = require('streamhub-sdk/jquery');
var URN = require('./urn');

/**
 * Get Subscriptions for a User
 * @param opts.lftoken
 * @param [opts.userUrn] {string} Will be derrived from lftoken if not provided
 */
exports.get = function (opts, errback) {
    var userUrn = opts.userUrn || URN.forUser(URN.userFromToken(opts.lftoken))
    var req = $.ajax({
        url: userSubscriptionsUrl({
            lftoken: opts.lftoken,
            userUrn: userUrn,
            quillHost: opts.host || quillHost(opts)
        })
    });
    req.done(function (res, textStatus, jqXhr) {
        errback(null, res.data.subscriptions);
    });
    req.fail(function (res) {
        errback(new Error('HTTP Error getting subscriptions: '+res))
    });
};

/**
 * Create a subscription
 */
exports.create = function (opts, errback) {
    var userUrn = opts.userUrn || URN.forUser(URN.userFromToken(opts.lftoken))
    var req = $.ajax({
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            subscriptions: opts.subscriptions
        }),
        url: userSubscriptionsUrl({
            lftoken: opts.lftoken,
            userUrn: userUrn,
            quillHost: opts.host || quillHost(opts)
        })
    });
    req.done(function (res, textStatus, jqXhr) {
        errback(null, res.data);
    });
    req.fail(function (res) {
        errback(new Error('HTTP Error creating subscriptions: '+JSON.stringify(res)))
    });
}

/**
 * Delete a subscription
 */
exports.delete = function (opts, errback) {
    var userUrn = opts.userUrn || URN.forUser(URN.userFromToken(opts.lftoken))
    var req = $.ajax({
        method: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({
            delete: opts.subscriptions
        }),
        url: userSubscriptionsUrl({
            lftoken: opts.lftoken,
            userUrn: userUrn,
            quillHost: opts.host || quillHost(opts)
        })
    });
    req.done(function (res, textStatus, jqXhr) {
        errback(null, res.data);
    });
    req.fail(function (res) {
        errback(new Error('HTTP Error deleting subscriptions: '+JSON.stringify(res)))
    });
}

var userSubscriptionsUrlTemplate = 'http://{quillHost}/api/v4/{userUrn}:subscriptions/?lftoken={lftoken}';
function userSubscriptionsUrl (opts) {
    return userSubscriptionsUrlTemplate
        .replace('{quillHost}', opts.quillHost)
        .replace('{lftoken}', opts.lftoken)
        .replace('{userUrn}', opts.userUrn);
}
function userSubscriptionsRequest(opts) {
    var req = url.parse(userSubscriptionsUrl(opts));
    log('userSubscriptionsRequest', req);
    return req;
}

function quillHost(opts) {
    var network = opts.network || networkFromToken(opts.lftoken);
    if (opts.network === 'livefyre.com') {
        return 'quill.livefyre.com';
    }
    return networkName(network) + '.quill.fyre.co';
}

function networkName(network) {
    return network.split('.')[0];
}

function networkFromToken(token) {
    return URN.userFromToken(token).network;
}
