import RPi.GPIO as GPIO
from picamera import PiCamera
from time import sleep
from datetime import datetime
GPIO.setmode(GPIO.BCM)

#Camera Options
camera = PiCamera()
camera.resolution = (1920, 1080)
camera.vflip = True

#The LED
led = 16
GPIO.setup(led, GPIO.OUT)


GPIO.output(led, 1)# Switch on the LED
camera.start_preview() #Start Camera
sleep(2) #CameraWarmup
filename = 'src/preview-img/' + datetime.now().strftime("%Y-%m-%d-%H:%M") + '.jpg' # Create timestamped filename
camera.capture(filename) # write file
print filename

GPIO.output(led, 0) # Close LED
GPIO.cleanup() #cleanup GPIO hooks in kernel
