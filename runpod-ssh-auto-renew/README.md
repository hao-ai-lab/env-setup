# RunPod SSH Auto-Renew

TLDR: Regenerate the SSH config file from your Runpod page. Avoid manually editing the SSH config file everytime you (re)start a new instance.




## Features

- Automatically detects all your RunPod instances
- Updates SSH configuration to allow easy connection to RunPod instances
- Provides a clear table view of all available RunPod instances
- Checks for prerequisites before running
- Provides helpful error messages

## Quick Start

Before using this script, you need to set up the following:

### Step 1: **Acquire a RunPod API Key**:

- Get your API key from the [RunPod dashboard](https://www.runpod.io/console/user/settings)

- Set it as an environment variable:
```bash
export RUNPOD_API_KEY=your_api_key
```

For permanent setup, add this to your `~/.bashrc`, `~/.zshrc`, or equivalent

### Step 2. **Create a SSH `~/.ssh/config.d` directory and ensure SSH Key is registered**:

> [!NOTE]
> 
> Many of you may not know this, but the `~/.ssh/config` file can actually include other files. This is a great way to manage your SSH connections to ensure things are modular.
> 
> See also: [Stackoverflow](https://superuser.com/questions/247564/is-there-a-way-for-one-ssh-config-file-to-include-another-one)

Create the `~/.ssh/config.d` directory:

```bash
# Create the SSH config.d directory:
mkdir -p ~/.ssh/config.d

# Ensure proper permissions:
chmod 700 ~/.ssh
chmod 700 ~/.ssh/config.d
```


If you already have content in your `~/.ssh/config` file, you may want to move that content to the `~/.ssh/config.d/` directory.
```
mv ~/.ssh/config ~/.ssh/config.d/original-config
```


Then modify your `~/.ssh/config` file to include the entire `~/.ssh/config.d` directory:
```
# ~/.ssh/config
Include ~/.ssh/config.d/*
```



Ensure you have an SSH key that conforms the runpod SSH key format, and have registered it in the RunPod dashboard (Settings -> SSH Public Keys). 

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519

# Ensure proper permissions:
chmod 600 ~/.ssh/id_ed25519
```


### Step 3. Installation

Install required Python packages:

```bash
pip install runpod sshconf rich
```

Clone this repository or download the script:
```bash
git clone https://github.com/hao-ai-lab/env-setup.git
cd runpod-ssh-auto-renew
```

Optionally move this directory to some other directory, and make the script executable:
```bash
mkdir -p ~/bin
cp refresh-runpod.py ~/bin/
chmod +x ~/bin/refresh-runpod.py
```

## Usage

1. Run the script:
   ```bash
   ./refresh-runpod.py
   ```

2. The script will:
   - Check for prerequisites
   - Connect to RunPod API
   - Retrieve all your RunPod instances
   - Update your SSH configuration
   - Display a table of all available RunPod instances

3. Connect to your RunPod instances:
   ```bash
   ssh pod_name
   ```
   Where `pod_name` is the name of your RunPod instance (spaces replaced with underscores)

## Customization

You can customize the script by modifying these variables at the top of the script:

```python
# Configuration - CUSTOMIZE THESE VALUES IF NEEDED
SSH_CONFIG_DIR = expanduser("~/.ssh/config.d")
SSH_CONFIG_FILE = f"{SSH_CONFIG_DIR}/runpod"
SSH_KEY_PATH = "~/.ssh/id_ed25519"
SSH_USER = "root"
```

## Troubleshooting

### "RUNPOD_API_KEY environment variable is not set"

Make sure you've set your RunPod API key as an environment variable:
```bash
export RUNPOD_API_KEY=your_api_key
```

### "SSH config directory does not exist"

Create the SSH config.d directory:
```bash
mkdir -p ~/.ssh/config.d
```

### "SSH key does not exist"

Create an SSH key:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
```

### "Failed to get RunPod instances"

Check your internet connection and ensure your RunPod API key is correct.

### "Failed to write SSH configuration"

Ensure you have write permissions to the SSH config.d directory:
```bash
chmod 700 ~/.ssh/config.d
```

## How It Works

1. The script connects to the RunPod API using your API key
2. It retrieves all your RunPod instances
3. For each instance, it extracts the IP address and port
4. It creates an SSH configuration entry for each instance
5. It writes the configuration to `~/.ssh/config.d/runpod`
6. It displays a table of all available RunPod instances

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
