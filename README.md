# orbitus_mock_api
&nbsp;This project represents a mock back-end application programming interface (API) that I originally designed for a school and side project of mine called "Orbitus", a scalable web system that generates personalized playlists for users depending on a song's genre and characteristics.  This project leverages the Node Package Manager (NPM), the Express.js framework to design a RESTful API and a Node.js HTTP server, different middleware packages, API unit testing on processed data and server endpoints, and effective logging and error-handling utilizing the Morgan.js HTTP request logger middleware and the Node.js Winston logging library.  It also implements security measures such as Helmet.js, HTTP request statistics, the configuration of Cross-Origin Resource Sharing (CORS), and rate limiters to prevent brute force attacks.

&nbsp;The idea behind this project is to create random song data using Faker.js to simulate the experience of creating, reading, modifying, or deleting songs from a database as part of a scalable web system.  OMA implements two in-memory databases (all data is created and stored in complete data structures on starting the process and ending the application).  It implements API endpoints and request, response, and error-handling, providing both a scalable, robust API that can generate playlists based on different "modes" or song characteristics, as well as create, read, update, or delete songs and playlists from the playlist database.
