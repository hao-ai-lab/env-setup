#!/usr/bin/env python3

import re
import argparse

# Set up argument parser
def parse_args():
    parser = argparse.ArgumentParser(
        description='Parse SSH keys from an input file and write them to an output file.',
        usage='%(prog)s [options] input'
    )
    parser.add_argument(
        'input', type=str, 
        help='Path to the input file containing SSH keys'
    )
    parser.add_argument(
        '-o', '--output', type=str, required=False, 
        default='authorized_keys.new',
        help='Path to the output file to write parsed SSH keys'
    )
    parser.add_argument(
        '-a', '--append', action='store_true',
        help='Append the new keys to the existing authorized_keys file'
    )

    # Parse the arguments
    args = parser.parse_args()
    return args

args = parse_args()
input_file = args.input
output_file = args.output
should_append = args.append


def parse_ssh_keys(input_text):
    # Regular expression to match SSH keys
    # This will match lines starting with ssh-ed25519, ssh-rsa, etc.
    ssh_key_pattern = r'((?:ssh-(?:ed25519|rsa|dss|ecdsa))\s+\S+\s+\S+@\S+)'
    
    # Find all matches in the input text
    keys = re.findall(ssh_key_pattern, input_text)
    return keys

# Read the input file
with open(input_file, 'r') as f:
    content = f.read()

# Parse the keys
parsed_keys = parse_ssh_keys(content)

# Write the keys to authorized_keys file
for key in parsed_keys:
    print(key)

if output_file:
    with open(output_file, 'w+') as f:
        for key in parsed_keys:
            f.write(key + '\n')

# print(f"Successfully parsed {len(parsed_keys)} SSH keys to {output_file}") 

# Append the new keys to the existing authorized_keys file
if should_append:
    with open(output_file, 'a') as f:
        f.write(content)
    # print(f"Successfully appended {len(parsed_keys)} SSH keys to {output_file}") 

