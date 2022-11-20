const bcrypt = require('bcrypt');

module.exports = {
    async up(db, client) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('admin', salt);

        await db.collection('users').insertOne({
            email: 'adminafek@walla.co.il',
            password: hash,
            phoneNumber: null,
            fullName: 'afek-admin',
            createdAt: Date.now(),
            updatedAt: null,
        });
    },

    async down(db, client) {
        await db
            .collection('users')
            .deleteOne({ email: 'adminafek@walla.co.il' });
    },
};
