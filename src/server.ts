import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import validator from "validator";
import onFinished from "on-finished";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    // get image_url query param from request:
    const image_url = req.query?.image_url;
    if (!image_url) {
      res.status(400).send("please provide an image_url query parameter!");
    }

    // check if image_url param contains a valid url string:
    const isImageUrlValid = validator.isURL(`${image_url}`);
    if (!isImageUrlValid) {
      res
        .status(422)
        .send(
          "The provided value for query param 'image_url' is not recognized as a valid url format."
        );
    }

    // call filterImageFromURL(image_url) to filter the image:
    const filteredImage = await filterImageFromURL(`${image_url}`);
    console.log("filteredImage: ", filteredImage);
    res.sendFile(filteredImage);

    // deletes any files on the server on finish of the response
    onFinished(res, function (err, res) {
      deleteLocalFiles([filteredImage]);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
