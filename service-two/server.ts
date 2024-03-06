import { connectMq } from "./config/rabbitmq.config";

const queue = "product_inventory";

(async () => {
  try {
    const connection = await connectMq();
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });

    await channel.consume(queue, (message) => {
      if (message) {
        console.log(
          " [x] Received '%s'",
          JSON.parse(message.content.toString())
        );

        // Send response back to Service 1
        channel.sendToQueue("product_inventory_rep",
          Buffer.from(JSON.stringify({ message: "Your response" }))
        );

        // Acknowledge message processing
        channel.ack(message);
      }
    },
      { noAck: false }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
})();
