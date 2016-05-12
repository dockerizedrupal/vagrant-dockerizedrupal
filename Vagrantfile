VERSION = "0.4.9"
VERSION_BASE_BOX = "0.4.8"

require 'yaml'

required_plugins = %w(vagrant-vbguest)

required_plugins.each do |plugin|
  system "vagrant plugin install #{plugin}" unless Vagrant.has_plugin? plugin
end

vm_config = YAML.load_file("config.yml")

Vagrant.configure("2") do |config|
  config.vm.box = "dockerizedrupal/base-ubuntu-trusty"
  config.vm.box_version = VERSION_BASE_BOX
  config.vm.box_check_update = false

  config.vm.hostname = vm_config["server_name"]

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

      vhost_run() {
        local server_name="${1}"
        local ip_address="${2}"

        sed -i "s/SERVER_NAME=dev/SERVER_NAME=${server_name}/" /opt/vhost.yml
        sed -i "s/HOSTS_IP_ADDRESS=192.18.11.89/HOSTS_IP_ADDRESS=${ip_address}/" /opt/vhost.yml

        docker-compose -f /opt/vhost.yml kill
        docker-compose -f /opt/vhost.yml rm -f
        docker-compose -f /opt/vhost.yml up -d
      }

      swap_resize "${MEMORY_SIZE}"
      vhost_run "${SERVER_NAME}" "${IP_ADDRESS}"
    SHELL

    s.args = [
      vm_config["memory_size"],
      vm_config["server_name"],
      vm_config["ip_address"],
    ]
  end
end
