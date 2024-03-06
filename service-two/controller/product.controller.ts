import { ConsumeMessage } from "amqplib";

export const getAllProduct = async (message: ConsumeMessage | null) => {
  if (message) {
    console.log(
      " [x] Received '%s'",
      JSON.parse(message.content.toString())
    );
  }
}