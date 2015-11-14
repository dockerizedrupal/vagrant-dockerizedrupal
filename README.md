# vagrant-dockerizedrupal

A Vagrant solution to develop using the dockerizedrupal stack on Windows. It works by mounting your project folder to /var/www/ on the guest. It also mounts the hosts file to automatically create and remove entries for project containers thanks to [vhost](https://github.com/dockerizedrupal/vhost).

## Usage

- Make sure you've installed [Vagrant](https://www.vagrantup.com/).

- Place the vagrantfile and config.yml in the directory where you keep your projects.

- Set variables inside config.yml as you see fit.

- Run: `vagrant up` and wait for vagrant to create the VM.

- Once up use `vagrant ssh` to enter the vm.

- Continue using the the VM for all your dockerizedrupal needs.

## License

**MIT**