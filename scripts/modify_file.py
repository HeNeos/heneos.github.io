import os
import sys
import json
import re

def processSubAndSuperscripts(input):
    subscript = r'(.*)\_\{([^\{\}]*)\}(.*)'
    superscript = r'(.*)\^\{([^\{\}]*)\}(.*)'
    while True:
        results = re.match(subscript, input, re.MULTILINE | re.DOTALL)
        if results is None:
            break
        input = results.group(1) + "_" + "_".join(results.group(2)) + results.group(3)

    while True:
        results = re.match(superscript, input, re.MULTILINE | re.DOTALL)
        if results is None:
            break
        input = results.group(1) + "^" + "^".join(results.group(2)) + results.group(3)

    return input

def latex2utf8(input):
    if input is None:
        return ""
    input = processSubAndSuperscripts(input)
    for key in mapping:
        input = input.replace(key, mapping[key])

    return input

def map_expression(expression):
    return latex2utf8(expression[1: -1])

def modify_line(line):
    prev_pos = 0
    expressions = []
    while True:
        start_pos = line.find("$", prev_pos)
        end_pos = line.find("$", start_pos+1)
        if start_pos == -1 or end_pos == -1:
            break
        expressions.append(line[start_pos: end_pos+1])
        prev_pos = end_pos+1

    new_line = line
    for expression in expressions:
        new_line = new_line.replace(expression, map_expression(expression))
    return new_line

def append_line(filename, line):
    with open(filename, 'a+', encoding="utf-8") as f:
        f.write(line)

def read_file(filename):
    name = os.path.split(filename)[-1]
    with open(filename, 'r') as f:
        lines = f.readlines()
        for line in lines:
            new_line = line
            if "$" in line:
                new_line = modify_line(line)
            append_line(f'../temp/{name}', new_line)

if __name__ == "__main__":
    filename = sys.argv[1]
    with open('mapping.json', encoding="utf-8") as f:
        mapping = json.load(f)
        read_file(filename)