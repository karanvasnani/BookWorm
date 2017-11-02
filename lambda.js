var https = require('http')

exports.handler = (event, context) => {
    
    var url = 'http://750f7630.ngrok.io/';

  try {

    if (event.session.new) {
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        console.log(`LAUNCH REQUEST`)
            context.succeed(
                generateResponse(
                    buildSpeechletResponse(`Hi, I can recommend you book to read and provide it\'s short summary. You can ask for help anytime`, false),
                    {}
                )
            )
       
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
            
            case "help":
                context.succeed (
                    generateResponse (
                        buildSpeechletResponse ('I can recommend you a book and provide you with it\'s short summary', false),
                        {}
                    )
                )
                break;
            
            case "getBookRecommendation":
            var endpoint = url + "recommendMeAbook"
            returnResultFromURL (endpoint, context);
    //         var options = {
    //             hostname: 'b045a82e.ngrok.io',
    //             path:'/1/sendQuestion',
    //             method: 'POST',
    //             headers: {
				//       'Content-Type': 'application/json',
				//   	},
				// body:JSON.stringify({question: answer})
    //         };
            break;

            case "getBookSummary":
                var endpoint = url + "getSummary";
                returnResultFromURL(endpoint, context);
                break;
                
            case "getBestSellerByAuthor":
                console.log("AUTHOR case");
                var author = event.request.intent.slots.authorName.value;
                console.log(author);
                break;
                
            case "getBestSellerByCategory":
                console.log(event.request.intent.slots.category.value);
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`You have reached best seller by Genre category`, true),
                    {}
                  )
                )
                break;
            
            case "stop":
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(``, false),
                    {}
                  )
                )
                break;
                
          default:
            //throw "Invalid intent"
             context.succeed(
                          generateResponse(
                            buildSpeechletResponse(`I didn\'t understand you. For options, you can ask for help.`, false),
                            {}
                          )
                        )
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

//api call

var returnResultFromURL = (endpoint, context) => {
    var body = "";
    https.get(endpoint, (response) => {
        response.on('data', (chunk) => { console.log(chunk); body += chunk });
        response.on('end', () => {
            var resp = body;
            context.succeed(
              generateResponse(
                buildSpeechletResponse(`${resp}`, false),
                {}
              )
            )
        })
    })
}