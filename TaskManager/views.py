from django.shortcuts import render, redirect
from django.http import Http404

# Create your views here.

from .models import Task
from .forms import TaskForm

def listTasks(request):
    tasks = Task.objects.all()
    form = TaskForm()
    context = {
        "tasks": tasks,
        "form": form
    }
    return render(request, 'TaskManager/List_Tasks.html', context)

def createTask(request):
    if request.method == "POST":
        title = request.POST['title']
        task = Task.objects.create(title=title)
        return redirect('task-list')
    else:
        return Http404('Invalid Request')

def deleteTask(request, id):
    task = Task.objects.get(pk=id)
    task.delete()
    return redirect('task-list')

def updateTask(request, id):
    task = Task.objects.get(pk=id)
    if request.method == "POST":
        form = TaskForm(request.POST, instance=task)
        if form.is_valid:
            form.save()
        return redirect('task-list')
    else:
        form = TaskForm(instance=task)
        context = {
            'form': form
        }
        return render(request, 'TaskManager/Update_Task.html', context)
        
