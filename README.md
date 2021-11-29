# simple task management application with node and react

there are 2 ways to bootstrap this project

- using docker-compose up at root folder
- run npm command for 2 sub project inside

some notes
backend

- i keep the current stage but update a little bit in card creation joi validation to allow notes as well as updatedAt property

frontend

- i chose next js for bootstraping because it is very simple as well as well prepared configuration
- browser fetcher for http request
- linter is combine between default eslint and little prettier
- react-toastify to show notification when s/t is happened
- for state management, valtio which is built on proxy-state is my choice. it provides a group of well functions, and very easy for interact into react, testing also. i started with redux rtk at the first time as usual but after thinking about that and some research i decided to use this library and got a good feeling about that.

- for project structure
  - common folder will hold everything which are shared on the whole application
  - modules, in the other hand will hold the code which is belonging to it - including its state. in this application is repo, list, and card
  - for some application state it will be located at highest level to reuse. in this situation, is info and error, which will be notified as well as collected and save back to monitor service.
