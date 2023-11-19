## Manual steps through EC2 Instance Connect

* Install git  
sudo yum install git -y

* Install dotnet sdk
sudo yum install dotnet-sdk-6.0 -y

* Clone repository
git clone https://github.com/TankSlayer1337/dotnet-api-on-linux.git

* Publish web app
cd dotnet-api-on-linux/ExampleWebAPI/ExampleWebAPI
dotnet publish --configuration Release

* Copy the app into directory
NOTE: it seems like all files created during publish is required, not only the ExampleWebAPI.dll
(first create the directory)
sudo mkdir /var/www
sudo mkdir /var/www/exampleapp
sudo cp -a bin/Release/net6.0/publish/. /var/www/exampleapp/

* Set port environment variables
export ASPNETCORE_HTTP_PORTS="80;8080"
export ASPNETCORE_HTTPS_PORTS="443;8081"

* Copy the service file
cd ../..
sudo cp weather-forecast-ec2-user.service /etc/systemd/system/kestrel-exampleapp.service

* Enable the service
NOTE: this does not work right now. The app will not run unless you use "sudo dotnet ExampleWebAPI.dll"
sudo systemctl enable kestrel-exampleapp.service

* Start the service
sudo systemctl start kestrel-exampleapp.service

* Verify that the service is running
sudo systemctl status kestrel-exampleapp.service