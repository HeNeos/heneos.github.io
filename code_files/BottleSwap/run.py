import os


if __name__ == "__main__":
    movements = []
    solution = []
    state = -1
    with open("MultiMovement.txt", "r") as file:
        lines = file.readlines()
        for line in lines:
            if line.startswith("SOLUTION"):
                state = 0
                continue
            elif line.startswith("MOVEMENTS"):
                state = 1
                continue
            if state == 0:
                solution.append(f'"{line.strip()}"')
            if state == 1:
                movements.append(f'"{line.strip()}"')

    solution = ",\n".join(solution)
    movements = ",\n".join(movements)

    with open("sketch.js", "r") as file:
        filedata = file.read()
        filedata = filedata.replace("STEPS", solution)
        filedata = filedata.replace("MOVEMENTS", movements)
    with open("sketch.js", "w") as file:
        file.write(filedata)