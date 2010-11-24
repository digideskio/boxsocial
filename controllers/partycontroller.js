var sys = require("sys");
var cutils = require("./cutils");

module.exports = function(lastfm, boxsocial, config) {
    return {
        index: {
            get: function(req, res) {
                var parties = this._boxsocial.parties;
                res.render("parties", { locals: { parties: parties } } );
            }
        },

        view: {
            get: function(req, res) {
                var host = req.params.host;
                var party = boxsocial.findParty({host: host});    

                if (party) {
                    res.render("party", { locals: { guest: req.session.guest, party: party, host: host } } );
                }
                res.render("noparty", { locals: { guest: req.session.guest, host: host } });
            }
        },

        chose: {
            get: function(req, res) {
                cutils.checkLoggedIn(req, res, "/join");
                res.render("join", { locals: { guest: req.session.guest } });        
            },
            post: function(req, res) {
                var host = req.param("host");
                cutils.checkLoggedIn(req, res, "/join/" + host);
                res.redirect("/join/" + host);
            }
        },

        join: {
            get: function(req, res) {
                var host = req.params.host;
                cutils.checkLoggedIn(req, res, "/join/" + host);
                res.render("join_confirm", { locals: { host: host } } );
            },

            post: function(req, res) {
                var host = req.params.host;
                cutils.checkLoggedIn(req, res, "/join/" + host);
                var guest = req.session.guest;
                boxsocial.attend(host, guest);
                var party = boxsocial.findParty({guest: guest});
                if (party) {
                    host = party.host;
                    sys.puts(guest.session.user + " has joined " + party.host + "'s party");
                }
                res.redirect("/party/" + host);
            }
        },

        leave: {
            get: function(req, res) {
                var guest = req.session.guest;
                if (guest) {
                    boxsocial.leave(guest);
                    sys.puts(guest.session.user + " has left the party.");
                }
                res.redirect("/");
            }
        }
    }
};
