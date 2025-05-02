from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from core.models import Post
from users.models import Follow
from core.serializers.post_serializers import PostSerializer

class FeedPagination(PageNumberPagination):
    page_size = 10  # posts por página

class FeedView(ListAPIView):
    serializer_class   = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class   = FeedPagination

    def get_queryset(self):
        user = self.request.user

        # Quem ele segue:
        following_ids = Follow.objects.filter(
            follower=user
        ).values_list('following_id', flat=True)

        # Permitir também os próprios posts:
        allowed_ids = list(following_ids) + [user.id]

        return (
            Post.objects
                .filter(author_id__in=allowed_ids)
                .order_by('-created_at')
        )
