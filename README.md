# Project-4 - Client's project(Inventory & Sales Management System)

Done By:
* [Jieying](https://github.com/thamjieying)
* [Hui Shi](https://github.com/pehhuishi)
* [Hazel](https://github.com/heyzernut)
* [Chongqiang](https://github.com/cqdotcom)
* [Si Ya](https://github.com/Siya-ng) <br>

------

# ERD Diagram

# ![](/public/assets/images/erd_project-4.png)

---------
# Wireframe

# ![](/public/assets/images/FullSizeRender.jpg)

---------



## Built With

What did you use to build it, list the technologies, plugins, gems, packages etc.

* [Node.js](https://nodejs.org/en/)
* [mongoose](http://mongoosejs.com/)
* [express](https://expressjs.com/)
---------


## Workflow

### Background
Client is an office furniture distributor that specializes in office chair and table systems.

Currently, they face an issue of not having a proper inventory management system to help them.

Some of the issues are

* Unable to accurately to know the inventory level of each product in real-time

* Need to manually track 'demo units' to respective resellers with location and date of issue

* Manual recording of Sales Invoices

* Manual recording of Purchase Orders

* Manual recording of Delivery Orders

* No proper keeping track of customer's details and past orders
------------------


### User Story

User(Admin & Employee only) must be able to add, view, edit supplier's and customer's/retailer's details.

User(Admin & Employee only) must be able to create, view and edit records of furniture model and the stocks information corresponding to that.

User(Admin & Employee only) must be able to generate delivery order (DO) with the information of the order items.

User(Admin & Employee only) must be able to view and edit the delivery order.

User must be able to view the tracking and update the tracking of the Delivery Order.

User must be able to generate and view the discrepancies.

------------------

# Development Logs

2 Dec 2017
* create repo & install the necessary dependencies
* create the models

3 Dec 2017
* add user routes
* add delivery routes
* add supplier routes
* add inventory routes

4 Dec 2017
* add CRUD for the customer
* able to create supplier and received stock
* able to add furniture model, add stock to the furniture model
* add location routes
* attempt with react as front end

5 Dec 2017
* scrap the idea of using react due to time constraint
* add CRUD for location
* add CRUD for furniture models & stocks
* able to create staff and view staff information
* add navigation bars, datatable.

6 Dec 2017
* add location and barcode for furniture model
* add create for delivery order
* add the table view for customer routes,
* add modal/ pop up information table for supplier's details & furniture model's stocks information
* add CRUD for category
* add header and breadcrumb to all routes
* add tracking routes and functionality

7 Dec 2017
* add autocomplete of furniture model's item code under delivery order form.
* working log in and log out
* add restriction of access for the different type of user. (delivery man are only allowed to access tracking routes.)
* edit the nav bar arrangement
* edit the view for all the routes, standardize the looks for all routes.

---------

## Acknowledgments

* Data table jQuery plugin (https://datatables.net/).

* Autocomplete jQuery plugin (http://easyautocomplete.com/).

* Handlebars helpers(https://www.npmjs.com/package/handlebars-helpers)
