const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const { getWeather } = require("./util");

async function executeAi(conversation) {
  console.log(JSON.stringify(conversation.messages));
  let client = new BedrockRuntimeClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    },
  });

  const command = new ConverseCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    messages: conversation.messages,
    system: [
      {
        text: "Act has a Personal Assistant.",
      },
    ],
    toolConfig: {
      tools: [
        {
          toolSpec: {
            name: "weather_forecast",
            description:
              "When ever user ask for a weather in particular city or country use this tool to fetch the current weather data.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  location: {
                    type: "string",
                    description:
                      "The location for which the weather needs to be obtained.",
                  },
                },
                required: ["location"],
              },
            },
          },
        },
      ],
    },
  });

  const data = await client.send(command);

  if (data.stopReason == "end_turn") {
    return data.output.message.content[0].text;
  }

  if (data.stopReason == "tool_use") {
    console.log("Using Tool");
    for await (let con of data.output.message.content) {
      if (con.toolUse) {
        switch (con.toolUse.name) {
          case "weather_forecast":
            console.log(
              "Calculate weather",
              JSON.stringify(data.output.message)
            );
            conversation.messages.push(data.output.message);
            await conversation.save();
            const weatherResponse = await getWeather(con.toolUse);
            console.log(JSON.stringify(weatherResponse));
            conversation.messages.push(weatherResponse);
            console.log(
              "Conversation after tool",
              JSON.stringify(conversation.messages)
            );

            return await executeAi(conversation);

          default:
            break;
        }
      }
    }
  }
}

module.exports = { executeAi };
