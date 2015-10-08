Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network :forwarded_port, guest: 80, host: 80
  config.vm.network :forwarded_port, guest: 443, host: 443

  config.vm.synced_folder "www/", "/var/www", create: true

  #config.vm.provider :virtualbox do |vb|
  #  vb.customize [ "guestproperty", "set", :id, "/VirtualBox/GuestAdd/VBoxService/--timesync-set-threshold", 10000 ]
  #end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get upgrade -y

    curl -sSL https://get.docker.com/ | sh

    sudo usermod -aG docker vagrant

    sudo wget https://github.com/docker/compose/releases/download/1.4.2/docker-compose-Linux-x86_64 -O /usr/local/bin/docker-compose \
      && sudo chmod +x /usr/local/bin/docker-compose

    TMP="$(mktemp -d)" \
      && git clone https://github.com/dockerizedrupal/drupal-compose.git "${TMP}" \
      && cd "${TMP}" \
      && git checkout 1.1.5 \
      && sudo cp "${TMP}/drupal-compose.sh" /usr/local/bin/drupal-compose \
      && sudo chmod +x /usr/local/bin/drupal-compose \
      && cd -

    TMP="$(mktemp -d)" \
      && git clone https://github.com/dockerizedrupal/crush.git "${TMP}" \
      && cd "${TMP}" \
      && git checkout 1.1.0 \
      && sudo cp "${TMP}/crush.sh" /usr/local/bin/crush \
      && sudo chmod +x /usr/local/bin/crush \
      && sudo ln -s /usr/local/bin/crush /usr/local/bin/drush \
      && cd -

    sudo wget https://raw.githubusercontent.com/dockerizedrupal/vhost/master/docker-compose.yml -O /opt/vhost.yml

    SERVER_NAME="dev"

    sudo sed -i "s/SERVER_NAME=localhost/SERVER_NAME=${SERVER_NAME}/" /opt/vhost.yml

    sudo docker-compose -f /opt/vhost.yml up -d
  SHELL
end
