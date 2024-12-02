# TaskFlow
please use below link 

# Get All Task 
http://18.183.48.246:3000/tasks/

# Create a Task 
http://18.183.48.246:3000/tasks/

body : {
    "title": "Buy laptop",
    "description": "dell, hp"
}

# update a task 
http://18.183.48.246:3000/tasks/517e63bc-d70d-49e1-9f23-93754bf4a075

body : {
  "status": "completed"
}

# delete a task 
http://18.183.48.246:3000/tasks/517e63bc-d70d-49e1-9f23-93754bf4a075

# get task by status 
http://18.183.48.246:3000/tasks/status/pending 
