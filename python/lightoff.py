import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
led = 13
GPIO.setup(led, GPIO.OUT)
# Switch off
GPIO.output(led, 0)
