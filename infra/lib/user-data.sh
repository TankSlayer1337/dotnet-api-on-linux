#!/bin/bash
# create certificates with certbot
dnf install -y augeas-libs
python3 -m venv /opt/certbot/
/opt/certbot/bin/pip install --upgrade pip
/opt/certbot/bin/pip install certbot
ln -s /opt/certbot/bin/certbot /usr/bin/certbot
certbot certonly --standalone --server https://acme-staging-v02.api.letsencrypt.org/directory -n -d weather.cloudchaotic.com -m erikandresall@gmail.com --agree-tos --keep

yum install git -y
yum install dotnet-sdk-6.0 -y
git clone https://github.com/TankSlayer1337/dotnet-api-on-linux.git
cd dotnet-api-on-linux/ExampleWebAPI/ExampleWebAPI
# dotnet publish will fail if DOTNET_CLI_HOME is not set
export DOTNET_CLI_HOME=/tmp
dotnet publish --configuration Release
mkdir /var/www
mkdir /var/www/exampleapp
cp -a bin/Release/net6.0/publish/. /var/www/exampleapp/
cd ../..
cp weather-forecast-root.service /etc/systemd/system/kestrel-exampleapp.service
systemctl enable kestrel-exampleapp.service
systemctl start kestrel-exampleapp.service
systemctl status kestrel-exampleapp.service