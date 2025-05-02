from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views.authentication import (
    UserRegisterView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    ProtectedView,
    LogoutView,
    UserDeleteView,
    UserUpdateView,
    FollowUserView,
    UnfollowUserView,
    FollowersListView,
    FollowingListView,
    
)
from .views.feed_views import FeedView

from .views.post_views import PostListCreateView, PostLikeToggleView, PostDetailView, PostSearchView, UserPostsView

from .views.user_views import UserListView

urlpatterns = [
    # Rotas de autenticação
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Rotas protegidas
    path('protected/', ProtectedView.as_view(), name='protected'),

    # Rotas de usuários
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/update/<int:pk>/', UserUpdateView.as_view(), name='user_update'),
    path('users/delete/<int:pk>/', UserDeleteView.as_view(), name='user_delete'),
    path('users/<str:username>/posts/', UserPostsView.as_view(),  name='user_posts'),

    # Rotas de posts
    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:pk>/like/', PostLikeToggleView.as_view(), name='post_like'),
    path('feed/', FeedView.as_view(), name='feed'),
    path('search/posts/', PostSearchView.as_view(), name='post_search'),

    # Rotas de seguidores
    path('users/<str:username>/follow/', FollowUserView.as_view(), name='follow_user'),
    path('users/<str:username>/unfollow/', UnfollowUserView.as_view(), name='unfollow_user'),
    path('users/<str:username>/followers/', FollowersListView.as_view(), name='followers_list'),
    path('users/<str:username>/following/', FollowingListView.as_view(), name='following_list'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
