USE link_management;

ALTER TABLE users
ADD avatar VARCHAR(500);

ALTER TABLE links
ADD url_title VARCHAR(500);