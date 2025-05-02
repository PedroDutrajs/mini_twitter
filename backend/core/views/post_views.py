from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.generics import ListAPIView
from django.db.models import Q

from core.models import Post
from core.serializers.post_serializers import PostSerializer


# Permissão customizada: leitura livre, escrita só para o autor
class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user


# Listar e criar posts
class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Detalhar, editar e deletar um post (apenas autor pode alterar/remover)
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("Você não tem permissão para editar este post.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("Você não tem permissão para deletar este post.")
        instance.delete()


# Curtir / Descurtir um post
class PostLikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'message': 'Like removido.'}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)
            return Response({'message': 'Post curtido!'}, status=status.HTTP_200_OK)


# Busca genérica de posts (q em content ou author.username)
class PostSearchView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Post.objects.filter(
            Q(content__icontains=q) |
            Q(author__username__icontains=q)
        ).order_by('-created_at')



# NOVA VIEW: somente posts de um usuário (profile)
class UserPostsView(ListAPIView):
    """
    Retorna apenas os posts do usuário {username} na URL.
    """
    serializer_class   = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        username = self.kwargs['username']
        return Post.objects.filter(
            author__username=username
        ).order_by('-created_at')
