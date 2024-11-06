const axios = require("axios");

async function getWeather(tool) {
  console.log("The Tool is ", tool);
  try {
    const weatherResp = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${tool.input.location}&aqi=no`
    );
    return {
      role: "user",
      content: [
        {
          toolResult: {
            toolUseId: tool.toolUseId,
            content: [
              {
                json: {
                  location: weatherResp.data.current.temp_c,
                },
              },
            ],
            status: "success",
          },
        },
      ],
    };
  } catch (error) {
    console.log(error.config);
    return {
      role: "user",
      content: [
        {
          toolResult: {
            toolUseId: tool.toolUseId,
            content: [
              {
                json: {
                  location: `Cant find weather`,
                },
              },
            ],
            status: "error",
          },
        },
      ],
    };
  }
}

module.exports = { getWeather };
