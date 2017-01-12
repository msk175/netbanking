/*
 * GET users listing.
 */

exports.list = function (req, res) {
    res.send("respond with a resource");
};

exports.create = function (req, res) {
    res.render('user/create_user', {title: 'Create new user', css_class: 'hide_content'});
};

exports.insert = function (connection) {
    return function (req, res) {
        var body = req.body;

        connection.query('INSERT INTO user SET user_name = ?, password = ?, first_name = ?, last_name=?, email=?, date_of_birth=?, phone=?, created_timestamp=?, last_updated_timstamp=?',
            [body.user_name, body.password, body.first_name, body.last_name, body.email, body.dob, body.phone, new Date(), new Date()], function (err, results) {
                if (err) {
                    res.send(err.message);
                }
                else {
                    res.send('New user created successfully');
                }
            });
    };
};