# dotnet-api-on-linux

## Resources and Information

### Networking
Security Groups, allow network traffic - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html

Assign an Elastic IP Address to the instance - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html

Route traffic to the instance - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-ec2-instance.html

### Hosting ASP.NET Core
Hosting Overview - https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/?view=aspnetcore-8.0

Host ASP.NET Core on Linux with Nginx - https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-8.0&tabs=linux-ubuntu

Unless Kestrel is placed behind a reverse proxy like Nginx, it needs to be configured to listen to ports 80 and 443. Default is localhost:5000 (or something like that).

#### Commands

EC2 User data and shell scripts
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html#user-data-shell-scripts
"Scripts entered as user data are run as the root user, so do not use the sudo command in the script."
"Also, because the script is not run interactively, you cannot include commands that require user feedback (such as yum update without the -y flag)."
"The cloud-init output log file captures console output so it is easy to debug your scripts following a launch if the instance does not behave the way you intended. To view the log file, connect to the instance and open /var/log/cloud-init-output.log."

Install the SDK. The .NET SDK allows you to develop apps with .NET. If you install the .NET SDK, you don't need to install the corresponding runtime. To install the .NET SDK, run the following command:
sudo yum install dotnet-sdk-6.0

Install the runtime. The ASP.NET Core Runtime allows you to run apps that were made with .NET that didn't provide the runtime. The following command installs the ASP.NET Core Runtime, which is the most compatible runtime for .NET. In your terminal, run the following command:
sudo yum install aspnetcore-runtime-6.0

Install git.
sudo yum install git

Publish an app.
dotnet publish --configuration Release

Publish an app self-contained. A Linux 64-bit executable is created.
dotnet publish -c Release -r linux-x64 --self-contained

#### Certificate
Configure SSL/TLS on Amazon Linux 2023: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2023.html#ssl_cert

Let's Encrypt - Getting Started: https://letsencrypt.org/getting-started/
Let's Encrypt - Staging Environment: https://letsencrypt.org/docs/staging-environment/
Using the staging server: https://eff-certbot.readthedocs.io/en/latest/using.html#changing-the-acme-server

Certbot docs: https://eff-certbot.readthedocs.io/en/latest/

Install certbot: https://unix.stackexchange.com/questions/741450/installing-lets-encrypt-on-amazon-linux-2023
sudo dnf install -y augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot

Follow certbot instructions after installation steps (6 and onward): https://certbot.eff.org/instructions?ws=other&os=centosrhel8
Command line options: https://eff-certbot.readthedocs.io/en/latest/using.html#certbot-command-line-options
sudo certbot certonly --standalone --server https://acme-staging-v02.api.letsencrypt.org/directory -n -d weather.cloudchaotic.com -m example@gmail.com --agree-tos

above command yields the following output:
Certificate is saved at: /etc/letsencrypt/live/weather.cloudchaotic.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/weather.cloudchaotic.com/privkey.pem

According to this link, the certificats should be automatically renewed: https://certbot.eff.org/instructions?ws=other&os=centosrhel8