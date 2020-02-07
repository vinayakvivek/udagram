import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {config} from './config/config';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    app.get("/filteredimage", async (req, res) => {
        
        let apiKey = req.header("x-api-key");

        if (!apiKey || apiKey !== config.api_key) {
            res.status(401).send({auth: false, message: 'Invalid api key.'})
        }
        
        let {image_url} = req.query;

        if (!image_url) {
            res.status(422).send({auth: true, message: "No image URL found"});
        }

        filterImageFromURL(image_url)
        .then((image_path) => {
            res.status(200).sendFile(image_path, () => {deleteLocalFiles([image_path])});
        })
        .catch((error) => {
            res.status(400).send({auth: true, message: "Invalid image URL"});
        });
    })

    //! END @TODO1

    // Root Endpoint
    // Displays a simple message to the user
    app.get( "/", async ( req, res ) => {
        res.send("try GET /filteredimage?image_url={{}}")
    } );


    // Start the Server
    app.listen( port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    } );
})();