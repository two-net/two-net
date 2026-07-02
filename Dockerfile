FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY ./published ./
ENTRYPOINT ["dotnet", "Two.Net.dll"]