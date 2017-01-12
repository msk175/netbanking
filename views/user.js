exports.create = function (req, res) {
    res.render('user/create_user', {title: 'Create new user', css_class: 'hide_content'});
};

exports.insert = function (connection) {
    return function (req, res) {
        var body = req.body;

        connection.query('INSERT INTO user SET acc_number = ?,opening_balance = ?,user_name = ?, password = ?, first_name = ?, last_name=?, email=?, dob=?, phone_number=?, created_timestamp=?, last_updated_timestamp=?',
            [body.acc_number, body.opening_balance, body.user_name, body.password, body.first_name, body.last_name, body.email, body.dob, body.phone, new Date(), new Date()], function (err, results) {
                if (err) {
                    res.send(err.message);
                }
                else {
                    res.send(/insert);
                }
            });
    };
};