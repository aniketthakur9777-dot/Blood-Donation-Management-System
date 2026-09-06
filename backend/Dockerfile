FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY BloodDonation.API/BloodDonation.API.csproj BloodDonation.API/
RUN dotnet restore BloodDonation.API/BloodDonation.API.csproj

COPY BloodDonation.API/ BloodDonation.API/
WORKDIR /src/BloodDonation.API

RUN dotnet publish BloodDonation.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "BloodDonation.API.dll"]
