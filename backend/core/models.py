from django.db import models
from users.models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()
class Post(models.Model):
    author = models.ForeignKey(CustomUser, related_name='posts', on_delete=models.CASCADE)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(CustomUser, related_name='liked_posts', blank=True)


    def __str__(self):
        return f'{self.author.username} - {self.content[:20]}'