import pyautogui
import time
import keyboard
import win32api, win32con

from pyautogui import *
from pytesseract import *
from dataclasses import dataclass
from PIL import Image

pytesseract.tesseract_cmd = r'C:\Users\heneo\AppData\Local\TesseractOCR\tesseract.exe'

def check_color(origin: tuple, check: tuple, error: tuple):
    for i in range(3):
        if origin[i] - check[i] > error[i]:
            return False
    return True

def click(position):
    x, y = position
    win32api.SetCursorPos((x,y))
    time.sleep(0.05)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,0,0)
    time.sleep(0.05)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,0,0)


# 769, 392          1150, 392
# 769, 506          1150, 506

def run():
    check_button = Button(position=(800, 900), color=(125, 189, 66))
    error_button = Button(position=(1120, 900), color=(211, 41, 42))
    time.sleep(0.4)
    while not keyboard.is_pressed('q'):
        time.sleep(0.14)
        img = pyautogui.screenshot(region=(769, 392, 381, 114))
        output = pytesseract.image_to_string(img)

        # print(f"raw output = {output}")
        output = output.replace('S', '5')
        output = output.replace('I', '1')
        output = output.replace('94', '2')
        output = output.replace('34', '3')
        output = output.replace('79', '+2')
        output = output.replace('72', '+2')
        output = output.replace(' ', '')
        # print(f"new output = {output}")

        operands, result = output.split('=')
        if '+' in operands:
            operands = operands.split('+')
        else:
            operands = operands.split('-')
            operands[-1] = f"-{operands[-1]}"
        
        operands = [int(x) for x in operands]
        ans = operands[0] + operands[1]

        if ans == int(result):
            print("Yay :)\n")
            click(check_button.position)
        else:
            print(f"Nope :(  {ans} != {result}")
            click(error_button.position)

if __name__ == "__main__":
    @dataclass
    class Button:
        position: tuple
        color: tuple
    run()