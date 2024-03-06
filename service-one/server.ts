import { ConsumeMessage } from "amqplib";
import express, { Application, Request, Response } from "express";
import { connectMq } from "./config/rabbitmq.config";

const app: Application = express();

const queue = "product_inventory";
const text = {
  item_id: "Hp",
  text: "This is a sample message to send receiver to check the ordered Item Availablility",
};

app.get("/", async (req: Request, res: Response) => {
  const connection = await connectMq();
  const channel = await connection.createChannel();

  try {
    await channel.assertQueue(queue, { durable: false });
    await channel.assertQueue("product_inventory_rep", { durable: false });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(text)), {
      replyTo: "product_inventory_rep"
    });

    await channel.consume("product_inventory_rep", (message: ConsumeMessage | null) => {
      if (message) {
        console.log(
          "Received from sernder",
          JSON.parse(message.content.toString())
        );
      }
    }, { noAck: true });

    return res.status(200).send("Message sent");
  } catch (err) {
    console.warn(err);
  } finally {
    await channel.close();
    if (connection) await connection.close();
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));