import mongoose from 'mongoose';

export async function connectDB(url: string) {
    await mongoose
        .connect(url)
        .then(() => {
            console.log('connected to database');
        })
        .catch((err) => {
            console.log(`failed to connect, error:${err}`);
            throw err;
        });
}
