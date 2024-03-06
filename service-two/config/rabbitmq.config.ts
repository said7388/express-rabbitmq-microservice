import amqp from "amqplib";

export const connectMq = async () => {
  const connection = await amqp.connect("amqp://localhost");
  connection.on('error', (err) => {
    console.log(err)
  });

  return connection;
};