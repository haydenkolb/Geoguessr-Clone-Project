# Geoguessr-Clone-Project

## Project Structure

The **dist folder** contains the index.css, the index.html, and the main.js. This folder contains our scource code for css, and html, but not js.
You can change the code on the html and css files but not the js file. And you can open up the live server by using the index.html.  

The **src folder** contains the project's JavaScript scource code. This folder will be where we wright our Javascript.
The JS files in this folder along with its dependcies (the imports) will be what is 'bundled' by Webpack 
into the main.js file in the dist folder. 

What the **other files** in the root directory are. The .gitignore file simply tells git to ignore certain files and folders.
The package-lock.json and package.json files tell NPM want depencies this project has as well as meta data of the project.
The webpack.config.js is just a file used to configure webpack. No need to touch any of these files. 

Once you have installed the project dependcies you will see a new folder pop up, which is **node_modules**. This folder will contain
all the project depnedcies (the firebase and webpack code). You should not touch it. 


## Terminal Commands
Before running any of the following commands make sure your current working directory is the root of this project (geoguessr-clone-project).

If you haven't installed the node modules then use this command to install them.  
> `npm install`

To build the "bundled" js file (main.js) run this command. You should run this command everytime after you change the JS in the src folder.  
> `npm run build`