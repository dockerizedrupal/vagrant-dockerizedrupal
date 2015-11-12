require 'yaml'

vm_config = YAML.load_file("config.yml")

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network :forwarded_port, guest: 80, host: 80
  config.vm.network :forwarded_port, guest: 443, host: 443

  config.vm.synced_folder "./", "/var/www", create: true
  config.vm.synced_folder File.expand_path('system32/drivers/', ENV['windir']), "/winhost"

  config.vm.provider "virtualbox" do |v|
    v.memory = vm_config['memory']
    v.cpus = vm_config['cpus']
  end

  config.vm.provision "shell" do |s|
    s.inline = <<-SHELL
      # size of swapfile in megabytes
      swapsize=$(($1*2))

      # does the swap file already exist?
      grep -q "swapfile" /etc/fstab

      # if not then create it
      if [ $? -ne 0 ]; then
        fallocate -l ${swapsize}m /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
      fi

      sudo apt-get update
      sudo apt-get upgrade -y

      wget -qO- https://get.docker.com/ | sh

      sudo usermod -aG docker vagrant

      sudo curl -L https://github.com/docker/compose/releases/download/1.5.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose \
        && sudo chmod +x /usr/local/bin/docker-compose

      tmp="$(mktemp -d)" \
        && git clone https://github.com/dockerizedrupal/drupal-compose.git "${tmp}" \
        && cd "${tmp}" \
        && git checkout 1.1.5 \
        && sudo cp "${tmp}/drupal-compose.sh" /usr/local/bin/drupal-compose \
        && sudo chmod +x /usr/local/bin/drupal-compose \
        && cd -

      tmp="$(mktemp -d)" \
        && git clone https://github.com/dockerizedrupal/crush.git "${tmp}" \
        && cd "${tmp}" \
        && git checkout 1.1.0 \
        && sudo cp "${tmp}/crush.sh" /usr/local/bin/crush \
        && sudo chmod +x /usr/local/bin/crush \
        && sudo ln -s /usr/local/bin/crush /usr/local/bin/drush \
        && cd -
        
      sudo curl -L https://raw.githubusercontent.com/dockerizedrupal/vhost/master/docker-compose.yml > /opt/vhost.yml
      sudo sed -i "s/SERVER_NAME=localhost/SERVER_NAME=${2}/" /opt/vhost.yml
      sudo sed -i "s|/etc/hosts|/winhost/etc/hosts|" /opt/vhost.yml

      sudo docker-compose -f /opt/vhost.yml up -d
    SHELL
    s.args = [vm_config['memory'],vm_config['server_name']]
  end
end
