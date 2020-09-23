CS193X Final Project
====================

Project Name: World Population Data Visualization
Your Name: Jiankai Xiao
Your SUNetID: jkxiao

I am using MongoDB to store some datasets collected from World Bank. Therefore, the most important thing to start this project is to import these datasets into MongoDB. It cannot be avoided since now we are running the frontend and backend at the same machine, which is not likely to happen in the real life. Here's how I do this:
1. open the datasets folder in a terminal;
2. make sure the MongoDB server is running, and run this two commands:
	mongoimport --type csv -d cs193x_project -c countries --headerline --drop data.csv
	mongoimport --type csv -d cs193x_project -c countries_meta --headerline --drop metadata_country.csv
3. if successful, the project can run perfectly
I have thought of hardcoding a JavaScript file to import all data into MongoDB after obtaining all documents by db.collection.find(), but it turns out that the dataset is so large that it is not possible to display all entries. If the method above does not work, please let me know and I will try some other way. Sorry for the inconvenience, appreciate your understanding.

Note: there is a create-or-update form on the right side of the screen (hover the "Inspire me!" to display it). After submitting, the client side needs to be restarted to show any change from the server side.