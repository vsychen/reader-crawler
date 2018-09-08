# The Reader
A specific crawler to get chinese light novels chapters.

# Requirements
Node.js

# Step-by-step
  1. Initialize the server
     1. Open your console.
     2. Go to reader-crawler folder.
     3. Run ```npm run start```
  2. Send the first URL to the server
     1. Open your browser
     2. Make a GET request to the URL ```localhost:<port>/crawl?url=<url>&title=<title>&chapters=<chapters>``` where
        * ```<port>``` is the port your server is listening (default is 8888)
        * ```<url>``` is the initial url
        * ```<title>``` is something in the page title to identify the useful URLs from the trash (a good choice would be... the novel's title)
        * ```<chapters>``` is the approximate amout of chapters the novel has
        * ```<encoding>``` is the encode the page has (it is optional, and the default is GBK)

# Author
[Victor Sin Yu Chen](https://github.com/vsychen)  
Center of Informatics (CIn), UFPE

# License
[The MIT License](https://raw.githubusercontent.com/vsychen/reader-crawler/master/LICENSE)