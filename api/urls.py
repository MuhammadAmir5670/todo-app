from django.urls import path

from .views import overview, taskList, TaskDetails, createTask, updateTask, deleteTask


app_name = "API"

urlpatterns = [
    path('', overview, name="api-overview"),
    path('task/all', taskList, name="task-list"),
    path('task/<int:id>', TaskDetails, name="task-details"),
    path('task/create', createTask, name="task-create"),
    path('task/update/<int:id>', updateTask, name="task-update"),
    path('task/delete/<int:id>', deleteTask, name="task-delete"),

]   