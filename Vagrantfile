VERSION = "0.4.1"

require 'yaml'

required_plugins = %w(vagrant-vbguest)

required_plugins.each do |plugin|
  system "vagrant plugin install #{plugin}" unless Vagrant.has_plugin? plugin
end

vm_config = YAML.load_file("config.yml")

VAGRANT_COMMAND = ARGV[0]

Vagrant.configure("2") do |config|
  config.vm.box = "dockerizedrupal/base-ubuntu-trusty"
  config.vm.box_version = VERSION
  config.vm.box_check_update = false

  config.vm.hostname = vm_config["server_name"]

  config.ssh.insert_key = false

  if VAGRANT_COMMAND == "ssh"
    config.ssh.username = "container"
  end

  config.vm.network "private_network", ip: vm_config["ip_address"]

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/var/www"

  config.vm.synced_folder File.expand_path("system32/drivers/", ENV["windir"]), "/winhost"

  config.vm.provider "virtualbox" do |v|
    name = "dockerizedrupal-" + VERSION

    name.gsub!(".", "-")

    v.name = name
    v.cpus = vm_config["cpus"]
    v.memory = vm_config["memory_size"]
  end

  config.vm.provision "shell", inline: "initctl emit vagrant-ready", run: "always"

  config.vm.provision "shell" do |s|
    s.inline = <<-SHELL
      MEMORY_SIZE="${1}"
      SERVER_NAME="${2}"
      IP_ADDRESS="${3}"

      swap_resize() {
        local memory_size="${1}"
        local swap_size=$((${memory_size}*2))

        swapoff -a

        fallocate -l "${swap_size}m" /swapfile

        chmod 600 /swapfile

        mkswap /swapfile
        swapon /swapfile

        sysctl vm.swappiness=10
        sysctl vm.vfs_cache_pressure=50
      }

      user_reconfigure() {
        cp -ar /home/vagrant/.ssh /home/container

        chown -R container.container /home/container/.ssh
      }

      vhost_run() {
        local server_name="${1}"
        local tmp="$(mktemp -d)"

        git clone https://github.com/dockerizedrupal/vhost.git "${tmp}"

        cd "${tmp}"

        git checkout 1.1.6

        cp ./docker-compose.yml /opt/vhost.yml

        sed -i "s/SERVER_NAME=localhost/SERVER_NAME=${server_name}/" /opt/vhost.yml
        sed -i "s/HOSTS_IP_ADDRESS=127.0.0.1/HOSTS_IP_ADDRESS=${IP_ADDRESS}/" /opt/vhost.yml
        sed -i "s|/etc/hosts|/winhost/etc/hosts|" /opt/vhost.yml

        docker-compose -f /opt/vhost.yml up -d
      }

      swap_resize "${MEMORY_SIZE}"
      user_reconfigure
      vhost_run "${SERVER_NAME}"
    SHELL

    s.args = [
      vm_config["memory_size"],
      vm_config["server_name"],
      vm_config["ip_address"],
    ]
  end
end
