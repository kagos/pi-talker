#!/user/bin/env python

import RPi.GPIO as GPIO, time, os

DEBUG=1
GPIO.setmode(GPIO.BCM)

def temphum (TEMPpin):
	reading=0
	GPIO.setup(TEMPpin, GPIO.OUT)
	GPIO.output(TEMPpin, GPIO.LOW)
	time.sleep(0.1)

	GPIO.setup(TEMPpin, GPIO.IN)
	while (GPIO.input(TEMPpin) == GPIO.LOW):
		reading += 1
	return reading
#while True:
print temphum(22)
