# World Population Data Visualization

CS193X Final Project
====================

Project Name: World Population Data Visualization
Your Name: Jiankai Xiao
Your SUNetID: jkxiao

This project uses MongoDB to store some datasets collected from World Bank. Therefore, if you want to run the it locally, here's how to import these datasets into MongoDB:
1. open the datasets folder in a terminal;
2. make sure the MongoDB server is running, and run this two commands:
	mongoimport --type csv -d cs193x_project -c countries --headerline --drop data.csv
	mongoimport --type csv -d cs193x_project -c countries_meta --headerline --drop metadata_country.csv
3. if successful, the project can run perfectly

Note: there is a create-or-update form on the right side of the screen (hover the "Inspire me!" to display it). After submitting, the client side needs to be restarted to show any change from the server side.
