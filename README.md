# fullstack-project3
 A movie API. Done using NodeJS and MongoDB. A school project

 ## Setup
 Add a MongoDB database uri as an environment variable: URI=(db uri)

 ## Features
 * Search movies either by id, or search parameters
 * Add movie
 * Change movie information
   * Title
   * Year
   * Poster url
 * Delete movie
 
 ## API routes
 All parameters besides id(url parameter) are read from request body parameters.
 * id
 * title
 * year
 * poster
 * limit

 ### /api/getall
 The basic search. Supports searching for a title and release year. Number of search results can be limited via a parameter. If not limited, all matching results are returned.

 ### /api/:id
 Search by id

 ### /api/add
 Adds a movie with the title, release year and poster url provided as parameters. Title and release year are required. If poster url is left blank, a placeholder is provided.

 ### /api/update/:id
 Updates a movie by id. Updated information provided as body parameters. Body parameters cannot be empty.

 ### /api/delete/:id
 Deletes a movie by id.

 ## To-do
 * Provide a basic search & add web front-end
 
 Online version to be provided after Heroku security breach has been resolved.