from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import TaskSerializer

from TaskManager.models import Task

# Create your views here.

@api_view(['GET'])
def overview(request):
    paths = [
        '/tasks/all',
        '/task/<int:id>',
        '/task/create',
        '/task/delete/<int:id>',
        '/task/update/<int:id>',
    ]
    return Response(paths)

@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def TaskDetails(request, id):
    task = Task.objects.get(pk=id)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)


@api_view(['Post'])
def createTask(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['Post'])
def updateTask(request, id):
    task = Task.objects.get(pk=id)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
        

@api_view(['DELETE'])
def deleteTask(request, id):
    task = Task.objects.get(pk=id)
    task.delete()
    return Response("Item deleted Successfully!")