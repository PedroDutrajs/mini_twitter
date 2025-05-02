
import re
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler
from rest_framework.exceptions import ValidationError, PermissionDenied, AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.serializers import ModelSerializer

from users.models import CustomUser, Follow

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        if isinstance(exc, ValidationError):
            response.data = {
                'status': 'error',
                'message': 'Erro de validação',
                'errors': response.data
            }
        else:
            response.data = {
                'status': 'error',
                'message': 'Ocorreu um erro inesperado.',
                'errors': response.data
            }
    return response


#  Serializers
class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise ValidationError("Este e-mail já está em uso.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("A senha deve ter pelo menos 8 caracteres.")
        if not re.search(r'\d', value):
            raise ValidationError("A senha deve conter pelo menos um número.")
        return value

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email is None or password is None:
            raise AuthenticationFailed("Email e senha são obrigatórios.")

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed("Usuário não encontrado.")

        if not user.check_password(password):
            raise AuthenticationFailed("Senha incorreta.")

        if not user.is_active:
            raise AuthenticationFailed("Usuário desativado.")

        # Gera os tokens
        refresh = self.get_token(user)
        access_token = str(refresh.access_token)

        return {
            'refresh': str(refresh),
            'access': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }


class UserUpdateSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance


#  Views de Autenticação e Usuário
class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [IsAuthenticated]


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if user != request.user:
            return Response(
                {'detail': 'Você não tem permissão para atualizar este usuário.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)


class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.kwargs['pk'])

    def perform_destroy(self, instance):
        if instance != self.request.user:
            raise PermissionDenied("Você não tem permissão para deletar este usuário.")
        instance.delete()


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Você está autenticado!"})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


#  Views de Follow / Unfollow / Followers / Following
class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_follow = get_object_or_404(CustomUser, username=username)
        if user_to_follow == request.user:
            return Response({'detail': 'Você não pode se seguir.'},
                            status=status.HTTP_400_BAD_REQUEST)
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user_to_follow
        )
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        detail = (f'Agora você segue {username}.'
                  if created else f'Você já segue {username}.')
        return Response({'detail': detail}, status=status_code)


class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        user_to_unfollow = get_object_or_404(CustomUser, username=username)
        follow = Follow.objects.filter(
            follower=request.user,
            following=user_to_unfollow
        ).first()
        if follow:
            follow.delete()
            return Response({'detail': f'Você deixou de seguir {username}.'},
                            status=status.HTTP_200_OK)
        return Response({'detail': 'Você não segue esse usuário.'},
                        status=status.HTTP_400_BAD_REQUEST)


class FollowersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        followers = user.followers.all()
        data = [
            {'id': f.follower.id, 'username': f.follower.username}
            for f in followers
        ]
        return Response(data, status=status.HTTP_200_OK)


class FollowingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        following = user.following.all()
        data = [
            {'id': f.following.id, 'username': f.following.username}
            for f in following
        ]
        return Response(data, status=status.HTTP_200_OK)
