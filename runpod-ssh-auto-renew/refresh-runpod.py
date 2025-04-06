#!/usr/bin/env /Users/mike/.pyenv/shims/python
"""
RunPod SSH Auto-Renew Script

This script automatically updates SSH configuration for RunPod instances.
It connects to RunPod API, retrieves pod information, and updates SSH config
to allow easy connection to RunPod instances.

Requirements:
- RunPod API key in environment variable RUNPOD_API_KEY
- SSH config.d directory at ~/.ssh/config.d/
- SSH key at ~/.ssh/id_ed25519
"""

import os
import sys
import runpod
from os.path import expanduser, exists
from sshconf import read_ssh_config, empty_ssh_config_file
from rich import print
from rich.console import Console
from rich.table import Table

# Initialize rich console for better output formatting
console = Console()

# Configuration - CUSTOMIZE THESE VALUES IF NEEDED
SSH_CONFIG_DIR = expanduser("~/.ssh/config.d")
SSH_CONFIG_FILE = f"{SSH_CONFIG_DIR}/runpod"
SSH_KEY_PATH = "~/.ssh/id_ed25519"
SSH_USER = "root"

def check_prerequisites():
    """Check if all prerequisites are met before running the script."""
    # Check if RunPod API key is set
    if not os.environ.get("RUNPOD_API_KEY"):
        console.print("[red][bold]Error:[/bold] RUNPOD_API_KEY environment variable is not set.[/red]")
        console.print("Please set it with: export RUNPOD_API_KEY=your_api_key")
        return False
    
    # Check if SSH config.d directory exists
    if not exists(SSH_CONFIG_DIR):
        console.print(f"[red][bold]Error:[/bold] SSH config directory {SSH_CONFIG_DIR} does not exist.[/red]")
        console.print(f"Please create it with: mkdir -p {SSH_CONFIG_DIR}")
        return False
    
    # Check if SSH key exists
    if not exists(expanduser(SSH_KEY_PATH)):
        console.print(f"[red][bold]Error:[/bold] SSH key {SSH_KEY_PATH} does not exist.[/red]")
        console.print("Please create an SSH key with: ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519")
        return False
    
    return True

def get_pods():
    """Get all RunPod instances."""
    try:
        return runpod.get_pods()
    except Exception as e:
        console.print(f"[red][bold]Error:[/bold] Failed to get RunPod instances: {e}[/red]")
        sys.exit(1)

def update_ssh_config(pods):
    """Update SSH configuration with RunPod instances."""
    # Create a new empty SSH config
    ssh_config = empty_ssh_config_file()
    
    entries = []
    for pod in pods:
        name = pod['name'].replace(' ', '_')
        try:
            runtime = pod['runtime']
            ports = runtime['ports']
            for item in ports:
                ip = item['ip']
                private_port = item['privatePort']
                public_port = item['publicPort']
                if private_port == 22:
                    entry = dict(
                        User=SSH_USER, 
                        Hostname=ip, 
                        Port=public_port, 
                        IdentityFile=SSH_KEY_PATH
                    )
                    ssh_config.add(name, **entry)
                    entries.append((name, f'{ip}:{public_port}'))
        except Exception as e:  
            console.print(f"[red][bold]{name}[/bold] {e}[/red]")
    
    return ssh_config, entries

def print_table(entries):
    """Print a formatted table of RunPod instances."""
    table = Table(title="RunPod SSH Configuration")
    table.add_column("Name", style="cyan")
    table.add_column("IP:Port", style="green")
    
    for name, ip in entries:
        table.add_row(name, ip)
    
    console.print(table)

def main():
    """Main function to update SSH configuration for RunPod instances."""
    # Check prerequisites
    if not check_prerequisites():
        sys.exit(1)
    
    # Get RunPod instances
    pods = get_pods()
    console.print(f"[bold]Found {len(pods)} RunPod instances[/bold]")
    
    # Update SSH configuration
    ssh_config, entries = update_ssh_config(pods)
    
    # Print table of RunPod instances
    print_table(entries)
    
    # Write SSH configuration
    try:
        ssh_config.write(SSH_CONFIG_FILE)
        console.print(f"[green][bold]Success:[/bold] SSH configuration updated at {SSH_CONFIG_FILE}[/green]")
    except Exception as e:
        console.print(f"[red][bold]Error:[/bold] Failed to write SSH configuration: {e}[/red]")
        sys.exit(1)

if __name__ == "__main__":
    main()
