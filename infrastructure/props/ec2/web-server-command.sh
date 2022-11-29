sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt install -y nginx
sudo apt install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install -u
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'OpenSSH'
sudo ufw enable
sudo systemctl enable nginx

sudo mkdir -p '/var/www/site/html'
sudo chmod -R 755 '/var/www/site'

sudo aws s3 cp s3://project-artifact-folder/.server-block.conf /etc/nginx/sites-enabled/site/site-server-block
sudo aws s3 cp s3://project-artifact-folder/security-header.conf /etc/nginx/security-headers.conf
sudo ln -s /etc/nginx/sites-available/site/site-server-block /etc/nginx/sites-enabled/
sudo systemctl start nginx

