import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'missing password'],
        },
        phoneNumber: {
            type: String,
            default: 'empty',
        },
        fullName: { type: String, default: 'unknown' },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10); // 10 = saltRounds
        const plaintextPassword = this.password;
        const hashed = bcrypt.hashSync(plaintextPassword, salt);

        this.password = hashed;
    }
    done();
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

export const UserModel = mongoose.model('user', userSchema);
