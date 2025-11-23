import mongoose from 'mongoose';
let ConnectionState= 0;
export async function connectToMongoDB() {
    if(ConnectionState==1) return ;
    const uri ="mongodb+"+process.env.DB_URI;
    const db=await mongoose.connect(uri);
    ConnectionState=db.connections[0].readyState
    console.log('Connected to MongoDB');
}
