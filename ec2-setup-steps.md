* Install git  
sudo yum install git
Add -y?

* Install dotnet sdk
sudo yum install dotnet-sdk-6.0

* Clone repository
git clone https://github.com/TankSlayer1337/dotnet-api-on-linux.git

* Publish web app
dotnet publish --configuration Release

* Copy the app into directory
cp dotnet-api-on-linux/ExampleWebAPI/ExampleWebAPI/src/ExampleWebAPI/bin/Release/net6.0/publish/ExampleWebAPI.dll var/www/exampleapp

* Copy the service file
cp dotnet-api-on-linux/weather-forecast-ec2-user.service /etc/systemd/system/kestrel-exampleapp.service

* Enable the service
sudo systemctl enable kestrel-exampleapp.service

* Start the service
sudo systemctl start kestrel-exampleapp.service

* Verify that the service is running
sudo systemctl status kestrel-exampleapp.service