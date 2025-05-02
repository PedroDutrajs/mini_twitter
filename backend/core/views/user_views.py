from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from users.models import CustomUser
from .authentication import UserRegisterSerializer

class UserListView(generics.ListAPIView):
    """
    Lista todos os usuários ou faz busca por ?search=termo
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        term = self.request.query_params.get('search')
        if term:
            qs = qs.filter(
                Q(username__icontains=term) |
                Q(email__icontains=term)
            )
        return qs
