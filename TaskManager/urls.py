from django.urls import path

from .views import listTasks, createTask, deleteTask, updateTask

urlpatterns = [
    path('', listTasks, name='task-list'),
    path('CreateTask', createTask, name='create-task'),
    path('deleteTask/<int:id>', deleteTask, name='delete-task'),
    path('updateTask/<int:id>', updateTask, name='update-task')
]