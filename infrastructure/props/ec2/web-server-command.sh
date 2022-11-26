sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt install -y nginx
sudo apt install -y unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'OpenSSH'
sudo ufw enable
sudo systemctl enable nginx

sudo mkdir -p /var/www/site/html
sudo chmod -R 755 /var/www/site

sudo cp 
