const bcrypt = require('bcrypt');

// Don't change\add-to this data! the tests have been built with this specific data
module.exports = {
    async up(db, client) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('admin', salt);

        await db.collection('users').insertOne({
            email: 'adminafek@walla.co.il',
            password: hashedPassword,
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
