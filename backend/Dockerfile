FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY BloodDonation.API/BloodDonation.API/BloodDonation.API.csproj BloodDonation.API/BloodDonation.API/

RUN dotnet restore BloodDonation.API/BloodDonation.API/BloodDonation.API.csproj

COPY . .

WORKDIR /src/BloodDonation.API/BloodDonation.API

RUN dotnet publish BloodDonation.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "BloodDonation.API.dll"]
