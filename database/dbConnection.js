import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_URL)
    .then((conn) =>
      console.log(
        `Database successfully connected on ${process.env.DB_CONNECTION_URL}`
      )
    )
    .catch((err) => console.log(`Database encountered an error: ${err}`));
};

export default dbConnection;
