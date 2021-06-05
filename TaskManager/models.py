from django.db import models

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=70, blank=False, null=False)
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField('Completed', default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_on']
        get_latest_by = 'created_on'

