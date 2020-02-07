import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

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
        let { image_url } = req.query;

        if (!image_url) {
            res.status(400).send("No image URL found");
        }

        filterImageFromURL(image_url)
        .then((image_path) => {
            res.sendFile(image_path, () => {deleteLocalFiles([image_path])});
        })
        .catch((error) => {
            res.status(400).send("Invalid image URL");
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